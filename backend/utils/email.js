'use strict';
const nodemailer = require('nodemailer');
const NotificationLog = require('../models/NotificationLog');

// ─────────────────────────────────────────────────────────────────
// Transporter Factory
// ─────────────────────────────────────────────────────────────────
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY }
    });
  }
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    // Uses port 465 (SSL) explicitly — port 587/STARTTLS is blocked on Render
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
  }
  // Dev fallback — just log
  return {
    sendMail: async (opts) => {
      console.log('[DEV EMAIL]', { to: opts.to, subject: opts.subject });
      return { messageId: 'dev-' + Date.now() };
    }
  };
};

// ─────────────────────────────────────────────────────────────────
// Core send function
// ─────────────────────────────────────────────────────────────────
const sendEmail = async (options) => {
  const transporter = createTransporter();
  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || process.env.GMAIL_USER || 'noreply@messwallah.com';

  const mailOptions = {
    from: `"MESS WALLAH" <${fromEmail}>`,
    to: options.to,
    subject: options.subject,
    text: options.text || '',
    html: options.html || '',
    attachments: options.attachments || []
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('[EMAIL SENT]', { to: options.to, subject: options.subject, id: result.messageId });

  // Track in NotificationLog
  try {
    const logMetadata = options.metadata || { type: 'welcome_message' };
    await NotificationLog.create({
      type: logMetadata.type,
      channel: 'email',
      toEmail: options.to,
      subject: options.subject,
      body: options.text || '',
      htmlBody: options.html || '',
      status: 'delivered',
      externalMessageId: result.messageId,
      sentAt: new Date(),
      deliveredAt: new Date(),
      toUserId: logMetadata.toUserId,
      bookingId: logMetadata.bookingId,
      roomId: logMetadata.roomId
    });
  } catch (logErr) {
    console.error('[EMAIL LOG ERROR]', logErr.message);
  }

  return result;
};

// ─────────────────────────────────────────────────────────────────
// Shared email wrapper styles
// ─────────────────────────────────────────────────────────────────
const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #E85D04 0%, #FB923C 100%); padding: 30px 40px; }
    .header h1 { color: white; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 13px; }
    .badge { display: inline-block; background: #16A34A; color: white; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 8px; margin: 24px 40px; }
    .content { padding: 10px 40px 30px; }
    .section-title { font-size: 11px; font-weight: 700; color: #E85D04; letter-spacing: 1px; text-transform: uppercase; margin: 24px 0 10px; }
    .info-table { width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; }
    .info-table tr:nth-child(odd) { background: #fafafa; }
    .info-table td { padding: 10px 14px; font-size: 13px; }
    .info-table .label { color: #6b7280; width: 45%; }
    .info-table .value { color: #111827; font-weight: 600; }
    .total-row { background: #1a1a1a !important; }
    .total-row td { color: white !important; font-size: 15px; font-weight: 700; padding: 14px; }
    .alert-box { background: #FFF7ED; border-left: 4px solid #E85D04; border-radius: 4px; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #78350f; }
    .footer { background: #E85D04; padding: 20px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.85); font-size: 11px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>MESS WALLAH · Student Accommodation Platform</p>
      <p style="margin-top:4px">support@messwallah.com · This is an automated notification</p>
    </div>
  </div>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────
// BUYER: Booking Confirmation Email (with PDF attachment)
// ─────────────────────────────────────────────────────────────────
const sendBuyerConfirmationEmail = async ({ buyer, owner, room, booking, pdfBuffer }) => {
  const p = booking.pricing || {};
  const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const checkOut = (() => {
    const d = new Date(booking.checkInDate);
    d.setMonth(d.getMonth() + booking.duration);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  })();

  const html = emailWrapper(`
    <div class="header">
      <h1>MESS WALLAH</h1>
      <p>Student Accommodation Platform</p>
    </div>
    <div class="badge">Booking Confirmed</div>
    <div class="content">
      <h2 style="margin:0 0 6px; font-size:20px; color:#111">Hi ${buyer.name},</h2>
      <p style="color:#4b5563; font-size:14px; margin:0 0 20px">
        Your booking has been <strong>confirmed</strong>. Your room is reserved. The PDF confirmation is attached to this email.
      </p>

      <div class="section-title">Booking Details</div>
      <table class="info-table">
        <tr><td class="label">Booking ID</td><td class="value" style="color:#E85D04; font-family:monospace">${booking.bookingId || booking._id}</td></tr>
        <tr><td class="label">Status</td><td class="value" style="color:#16A34A">CONFIRMED</td></tr>
        <tr><td class="label">Check-in Date</td><td class="value">${checkIn}</td></tr>
        <tr><td class="label">Check-out Date</td><td class="value">${checkOut}</td></tr>
        <tr><td class="label">Duration</td><td class="value">${booking.duration} Month${booking.duration > 1 ? 's' : ''}</td></tr>
      </table>

      <div class="section-title">Property Details</div>
      <table class="info-table">
        <tr><td class="label">Property</td><td class="value">${room.title}</td></tr>
        <tr><td class="label">Location</td><td class="value">${[room.address?.area, room.address?.city, room.address?.state].filter(Boolean).join(', ')}</td></tr>
        <tr><td class="label">Room Type</td><td class="value">${(room.roomType || 'Room').toUpperCase()}</td></tr>
        <tr><td class="label">Owner</td><td class="value">${owner?.name || 'Property Owner'}</td></tr>
        <tr><td class="label">Owner Phone</td><td class="value">${owner?.phone || 'N/A'}</td></tr>
      </table>

      <div class="section-title">Payment Summary</div>
      <table class="info-table">
        <tr><td class="label">Rent × ${booking.duration} months</td><td class="value">₹${((p.monthlyRent || 0) * booking.duration).toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Security Deposit</td><td class="value">₹${(p.securityDeposit || 0).toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Platform Fee (5%)</td><td class="value">₹${(p.platformFee || 0).toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">GST (18% on fee)</td><td class="value">₹${(p.tax || 0).toLocaleString('en-IN')}</td></tr>
        <tr class="total-row"><td class="label" style="color:white; font-weight:700">TOTAL PAID</td><td class="value" style="color:#FB923C; font-size:18px">₹${(p.totalAmount || 0).toLocaleString('en-IN')}</td></tr>
      </table>

      <div class="alert-box">
        <strong>Important:</strong> Please show your Booking ID <strong>${booking.bookingId || booking._id}</strong> or this email at check-in. The attached PDF is your proof of booking.
      </div>
    </div>
  `);

  await sendEmail({
    to: buyer.email,
    subject: `Booking Confirmed! ${room.title} — ${booking.bookingId || booking._id}`,
    html,
    text: `Booking Confirmed!\n\nBooking ID: ${booking.bookingId || booking._id}\nRoom: ${room.title}\nCheck-in: ${checkIn}\nDuration: ${booking.duration} month(s)\nTotal: ₹${(p.totalAmount || 0).toLocaleString('en-IN')}\n\nPlease find your PDF confirmation attached.`,
    metadata: {
      type: 'booking_confirmation_to_tenant',
      toUserId: buyer._id,
      bookingId: booking._id,
      roomId: room._id
    },
    attachments: pdfBuffer ? [{
      filename: `MESS-WALLAH-Booking-${booking.bookingId || booking._id}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }] : []
  });
};

// ─────────────────────────────────────────────────────────────────
// SELLER/OWNER: New Booking Alert Email
// ─────────────────────────────────────────────────────────────────
const sendOwnerAlertEmail = async ({ owner, buyer, room, booking }) => {
  const p = booking.pricing || {};
  const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const si = booking.seekerInfo || {};

  const html = emailWrapper(`
    <div class="header">
      <h1>MESS WALLAH</h1>
      <p>Owner Dashboard Notification</p>
    </div>
    <div class="badge">New Booking Request</div>
    <div class="content">
      <h2 style="margin:0 0 6px; font-size:20px; color:#111">Hi ${owner.name},</h2>
      <p style="color:#4b5563; font-size:14px; margin:0 0 20px">
        You have received a <strong>new booking request</strong> for your property. Please review the details below.
      </p>

      <div class="section-title">Your Property</div>
      <table class="info-table">
        <tr><td class="label">Property</td><td class="value">${room.title}</td></tr>
        <tr><td class="label">Booking ID</td><td class="value" style="color:#E85D04; font-family:monospace">${booking.bookingId || booking._id}</td></tr>
        <tr><td class="label">Check-in Date</td><td class="value">${checkIn}</td></tr>
        <tr><td class="label">Duration</td><td class="value">${booking.duration} Month${booking.duration > 1 ? 's' : ''}</td></tr>
        <tr class="total-row"><td class="label" style="color:white; font-weight:700">Booking Amount</td><td class="value" style="color:#FB923C">₹${(p.ownerAmount || 0).toLocaleString('en-IN')}</td></tr>
      </table>

      <div class="section-title">Tenant Details</div>
      <table class="info-table">
        <tr><td class="label">Full Name</td><td class="value">${si.name || buyer?.name || '—'}</td></tr>
        <tr><td class="label">Email</td><td class="value">${si.email || buyer?.email || '—'}</td></tr>
        <tr><td class="label">Phone</td><td class="value">${si.phone || buyer?.phone || '—'}</td></tr>
        ${booking.specialRequests ? `<tr><td class="label">Special Requests</td><td class="value">${booking.specialRequests}</td></tr>` : ''}
      </table>

      <div class="alert-box">
        Your room is now marked as <strong>reserved</strong>. Log into your owner dashboard to manage this booking.
      </div>
    </div>
  `);

  await sendEmail({
    to: owner.email,
    subject: `New Booking: ${room.title} from ${si.name || buyer?.name} — ${booking.bookingId || booking._id}`,
    html,
    text: `New Booking Request!\n\nBooking ID: ${booking.bookingId || booking._id}\nProperty: ${room.title}\nTenant: ${si.name || buyer?.name}\nPhone: ${si.phone || buyer?.phone}\nCheck-in: ${checkIn}\nDuration: ${booking.duration} months\n\nLog in to your dashboard to manage this booking.`,
    metadata: {
      type: 'booking_request_to_owner',
      toUserId: owner._id,
      bookingId: booking._id,
      roomId: room._id
    }
  });
};

// ─────────────────────────────────────────────────────────────────
// BUYER: Booking Status Update (Confirmed/Rejected)
// ─────────────────────────────────────────────────────────────────
const sendBookingStatusUpdate = async (email, phone, payload) => {
  const isConfirmed = payload.status === 'confirmed';
  const html = emailWrapper(`
    <div class="header">
      <h1>MESS WALLAH</h1>
      <p>Booking Update</p>
    </div>
    <div class="content">
      <h2>Your Booking is ${payload.status.toUpperCase()}</h2>
      <p>Your request for <strong>${payload.roomTitle}</strong> has been updated.</p>
      <div class="alert-box">
        ${payload.message}
      </div>
      <p>Booking ID: ${payload.bookingId}</p>
    </div>
  `);

  await sendEmail({
    to: email,
    subject: `Booking ${payload.status}: ${payload.roomTitle}`,
    html,
    text: `Your booking for ${payload.roomTitle} is ${payload.status}.\n${payload.message}`,
    metadata: {
      type: isConfirmed ? 'booking_confirmation_to_tenant' : 'booking_rejection_to_tenant'
    }
  });
};

// ─────────────────────────────────────────────────────────────────
// BUYER/SELLER: Booking Cancellation
// ─────────────────────────────────────────────────────────────────
const sendBookingCancellation = async (email, phone, payload) => {
  const html = emailWrapper(`
    <div class="header" style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);">
      <h1>MESS WALLAH</h1>
      <p>Booking Cancellation</p>
    </div>
    <div class="content">
      <h2>Booking CANCELLED</h2>
      <p>The booking for <strong>${payload.roomTitle}</strong> (ID: ${payload.bookingId}) has been cancelled.</p>
      <div class="alert-box">
        Reason: ${payload.reason || 'No reason provided.'}
      </div>
      ${payload.refundAmount ? `<p>Refund Amount: ₹${payload.refundAmount}</p>` : ''}
    </div>
  `);

  await sendEmail({
    to: email,
    subject: `Booking Cancelled: ${payload.roomTitle}`,
    html,
    text: `Booking Cancelled: ${payload.roomTitle}\nReason: ${payload.reason || 'N/A'}`,
    metadata: {
      type: 'booking_cancellation'
    }
  });
};

module.exports = {
  sendEmail,
  sendBuyerConfirmationEmail,
  sendOwnerAlertEmail,
  sendBookingStatusUpdate,
  sendBookingCancellation
};
