import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiUser, FiMail, FiPhone, FiCheck, FiAlertCircle, FiChevronRight, FiChevronLeft, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';

// ─── Steps ─────────────────────────────────────────────
// 1. Fill Details (date, duration, name, email, phone, notes)
// 2. Review Summary (no API yet)
// 3. API: create booking → Razorpay payment (or skip if not configured)
// 4. Booking Confirmed

const STEPS = ['Details', 'Review', 'Payment', 'Done'];

const BookingModal = ({ room, onClose, user }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [paymentSkipped, setPaymentSkipped] = useState(false);

  const [form, setForm] = useState({
    checkInDate: '',
    duration: 1,
    specialRequests: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    aadharNo: '',
    profession: '',
    age: '',
  });

  // ─── Pricing Calculation ──────────────────────────────
  const pricing = (() => {
    const monthlyRent = room?.rentPerMonth || 0;
    const securityDeposit = room?.securityDeposit || 0;
    const duration = form.duration;
    const rentTotal = monthlyRent * duration;
    const platformFee = Math.round(rentTotal * 0.05);
    const tax = Math.round(platformFee * 0.18);
    const totalAmount = rentTotal + securityDeposit + platformFee + tax;
    return { monthlyRent, securityDeposit, rentTotal, platformFee, tax, totalAmount };
  })();

  // ─── Validation ───────────────────────────────────────
  const validateStep1 = () => {
    if (!form.checkInDate) { toast.error('Please select a check-in date'); return false; }
    const d = new Date(form.checkInDate);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (d < today) { toast.error('Check-in date cannot be in the past'); return false; }
    if (!form.name || form.name.trim().length < 2) { toast.error('Please enter your full name'); return false; }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) { toast.error('Please enter a valid email address'); return false; }
    const phoneOk = /^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''));
    if (!phoneOk) { toast.error('Please enter a valid 10-digit Indian mobile number'); return false; }

    // Safety identity validations
    const aadharOk = /^\d{12}$/.test(form.aadharNo.replace(/\s/g, ''));
    if (!aadharOk) { toast.error('Please enter a valid 12-digit Aadhar number for safety purposes'); return false; }
    if (!form.profession || form.profession.trim().length < 2) { toast.error('Please enter your profession (e.g., Student, Software Engineer)'); return false; }
    if (!form.age || isNaN(form.age) || form.age < 16 || form.age > 100) { toast.error('Please enter a valid age (16-100)'); return false; }

    return true;
  };

  // ─── Step 3: Create Booking + Payment ────────────────
  const handleCreateBookingAndPay = async () => {
    try {
      setLoading(true);

      // 1. Create booking on backend
      const bookingRes = await api.post('/bookings', {
        roomId: room._id,
        checkInDate: form.checkInDate,
        duration: form.duration,
        seekerInfo: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          aadharNo: form.aadharNo,
          profession: form.profession,
          age: Number(form.age)
        },
        specialRequests: form.specialRequests,
      });

      if (!bookingRes.data.success) {
        throw new Error(bookingRes.data.message || 'Booking creation failed');
      }

      const booking = bookingRes.data.data.booking || bookingRes.data.data;
      setBookingConfirmation(booking);

      // 2. Try to create Razorpay order
      let razorpayOrder = null;
      try {
        const orderRes = await api.post('/payments/create-order', {
          amount: pricing.totalAmount * 100,
          currency: 'INR',
          bookingId: booking._id,
          notes: { roomTitle: room.title, checkInDate: form.checkInDate, duration: form.duration },
        });
        if (orderRes.data.success) {
          razorpayOrder = orderRes.data.data;
        }
      } catch (payErr) {
        // Razorpay not configured — proceed as booking-request-only
        console.warn('[Booking] Razorpay not configured, skipping payment:', payErr.message);
      }

      if (!razorpayOrder) {
        // No payment gateway — booking request submitted, owner will confirm
        setPaymentSkipped(true);
        setStep(4);
        toast.success('Booking request sent! Owner will confirm shortly.');
        setLoading(false);
        return;
      }

      // 3. Load Razorpay SDK and open checkout
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Could not load payment gateway. Your booking request has been saved.');
        setPaymentSkipped(true);
        setStep(4);
        setLoading(false);
        return;
      }

      setStep(3); // show payment step UI

      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'MESS WALLAH',
        description: `Booking for ${room.title}`,
        order_id: razorpayOrder.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#F97316' },
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            if (verifyRes.data.success) {
              setStep(4);
              toast.success('Payment successful! Booking confirmed.');
            } else {
              toast.error('Payment verification failed. Contact support with your booking ID.');
            }
          } catch (e) {
            toast.error('Payment verification error. Contact support if money was deducted.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled. Your booking request is still saved.');
            setStep(4); // still show confirmation with pending payment status
            setPaymentSkipped(true);
          },
        },
      };

      const rp = new window.Razorpay(options);
      rp.open();
      setLoading(false);

    } catch (error) {
      console.error('Booking error:', error);
      setLoading(false);
      const msg = error.response?.data?.message || error.message || 'Booking failed. Please try again.';
      toast.error(msg);
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ─── Helpers ─────────────────────────────────────────
  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-1">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${done ? 'bg-white text-orange-500 shadow-lg scale-110'
                  : active ? 'bg-white/90 text-orange-600 shadow-lg scale-110 ring-2 ring-white/50'
                    : 'bg-white/20 text-white/60'}`}>
                {done ? <FiCheck className="w-4 h-4" /> : num}
              </div>
              <span className="text-[10px] mt-1 text-white/80">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-10 h-0.5 rounded-full mb-4 transition-all ${done ? 'bg-white' : 'bg-white/20'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const PriceSummary = ({ compact = false }) => (
    <div className={`bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-5 space-y-2 ${compact ? 'text-sm' : ''}`}>
      {[
        [`Rent × ${form.duration} month${form.duration > 1 ? 's' : ''}`, `₹${pricing.rentTotal.toLocaleString()}`],
        ['Security Deposit', `₹${pricing.securityDeposit.toLocaleString()}`],
        ['Platform Fee (5%)', `₹${pricing.platformFee.toLocaleString()}`],
        ['GST (18% on fee)', `₹${pricing.tax.toLocaleString()}`],
      ].map(([label, val]) => (
        <div key={label} className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>{label}</span><span className="font-semibold text-gray-900 dark:text-white">{val}</span>
        </div>
      ))}
      <div className="border-t border-orange-200 dark:border-gray-500 pt-3 flex justify-between">
        <span className="font-bold text-gray-900 dark:text-white text-lg">Total</span>
        <span className="font-black text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          ₹{pricing.totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-6 text-white relative flex-shrink-0">
            <h3 className="text-xl font-bold mb-1 pr-8">
              {room?.title?.length > 40 ? room.title.slice(0, 40) + '…' : room?.title}
            </h3>
            <p className="text-white/80 text-sm mb-5">{room?.address?.area}, {room?.address?.city}</p>
            <StepIndicator />
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* STEP 1: Fill Details */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Your Details</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Check-in Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input type="date" value={form.checkInDate}
                        onChange={e => updateForm('checkInDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration <span className="text-red-500">*</span></label>
                    <select value={form.duration} onChange={e => updateForm('duration', parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white text-sm">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                        <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'name', icon: <FiUser className="w-4 h-4" />, type: 'text', placeholder: 'Your full name' },
                    { label: 'Email', key: 'email', icon: <FiMail className="w-4 h-4" />, type: 'email', placeholder: 'your@email.com' },
                    { label: 'Phone', key: 'phone', icon: <FiPhone className="w-4 h-4" />, type: 'tel', placeholder: '10-digit mobile number', maxLength: 10 },
                    { label: 'Aadhar No (Safety)', key: 'aadharNo', icon: <FiCheck className="w-4 h-4" />, type: 'text', placeholder: '12-digit Aadhar No', maxLength: 12 },
                    { label: 'Profession', key: 'profession', icon: <FiUser className="w-4 h-4" />, type: 'text', placeholder: 'e.g. Student, Engineer' },
                    { label: 'Age', key: 'age', icon: <FiCalendar className="w-4 h-4" />, type: 'number', placeholder: 'Age (e.g. 22)', maxLength: 3 },
                  ].map(({ label, key, icon, type, placeholder, maxLength }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                        <input type={type} value={form[key]}
                          onChange={e => updateForm(key, e.target.value)}
                          maxLength={maxLength}
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder={placeholder}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests <span className="text-gray-400">(optional)</span></label>
                  <textarea value={form.specialRequests} onChange={e => updateForm('specialRequests', e.target.value)}
                    rows={2} maxLength={500}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white resize-none text-sm"
                    placeholder="Any special requirements..." />
                  <p className="text-xs text-gray-400 mt-0.5 text-right">{form.specialRequests.length}/500</p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Review Your Booking</h4>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Name</span><span className="font-semibold dark:text-white">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Email</span><span className="font-semibold dark:text-white">{form.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Phone</span><span className="font-semibold dark:text-white">{form.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Check-in</span><span className="font-semibold dark:text-white">{new Date(form.checkInDate).toLocaleDateString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Duration</span><span className="font-semibold dark:text-white">{form.duration} month{form.duration > 1 ? 's' : ''}</span></div>
                </div>

                <PriceSummary />

                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                  <FiAlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    By proceeding you agree to the booking policies. Payment is processed securely via Razorpay. If payment is not configured, a booking request will be sent to the owner.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment in progress */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <FiLoader className="w-10 h-10 text-white animate-spin" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Payment Window Open</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                  Complete the payment in the Razorpay window. This page will update automatically once done.
                </p>
              </motion.div>
            )}

            {/* STEP 4: Done */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce ${paymentSkipped ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
                  <FiCheck className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {paymentSkipped ? 'Booking Request Sent!' : 'Booking Confirmed!'}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {paymentSkipped
                    ? 'The owner will review and confirm your booking soon.'
                    : 'Payment received! Confirmation emails sent to you and the owner.'}
                </p>

                {bookingConfirmation && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-left text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Booking ID</span><span className="font-mono font-bold text-orange-500">{bookingConfirmation.bookingId || bookingConfirmation._id}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Room</span><span className="font-semibold dark:text-white">{room?.title}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-semibold dark:text-white">{new Date(form.checkInDate).toLocaleDateString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Amount</span>
                      <span className={`font-bold ${paymentSkipped ? 'text-yellow-500' : 'text-green-500'}`}>
                        {paymentSkipped ? 'Pending' : `₹${pricing.totalAmount.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="p-5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex gap-3">
              {step === 1 && (
                <>
                  <button onClick={onClose}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 transition-all text-sm">
                    Cancel
                  </button>
                  <button onClick={() => { if (validateStep1()) setStep(2); }}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                    Review <FiChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <button onClick={() => setStep(1)} disabled={loading}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 text-sm">
                    <FiChevronLeft className="inline w-4 h-4 mr-1" />Edit
                  </button>
                  <button onClick={handleCreateBookingAndPay} disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                    ) : (`Confirm & Pay ₹${pricing.totalAmount.toLocaleString()}`)}
                  </button>
                </>
              )}

              {step === 3 && (
                <p className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                  Waiting for payment confirmation…
                </p>
              )}

              {step === 4 && (
                <>
                  <button
                    onClick={async () => {
                      if (bookingConfirmation) {
                        try {
                          const res = await api.get(`/bookings/${bookingConfirmation._id || bookingConfirmation.bookingId}/pdf`, { responseType: 'blob' });
                          const url = window.URL.createObjectURL(new Blob([res.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `MESS-WALLAH-Booking-${bookingConfirmation.bookingId || bookingConfirmation._id}.pdf`);
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        } catch (e) {
                          toast.error('Failed to download PDF. Check your email instead.');
                        }
                      }
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm"
                  >
                    Download PDF Ticket
                  </button>
                  <button onClick={() => window.location.href = '/bookings'}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm">
                    View My Bookings
                  </button>
                  <button onClick={onClose}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 transition-all text-sm">
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
