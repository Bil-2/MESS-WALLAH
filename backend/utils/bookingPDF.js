'use strict';
const PDFDocument = require('pdfkit');

/**
 * Generate an OYO-style booking confirmation PDF as a Buffer.
 * No file is written to disk — returned as a Buffer for email attachment.
 */
const generateBookingPDF = (booking, room, buyer, owner) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const orange = '#E85D04';
    const dark = '#1A1A1A';
    const gray = '#555555';
    const light = '#F5F5F5';
    const green = '#16A34A';

    // ── HEADER BANNER ──────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 90).fill(orange);
    doc.fontSize(26).fillColor('white').font('Helvetica-Bold')
      .text('MESS WALLAH', 40, 22);
    doc.fontSize(11).font('Helvetica')
      .text('Student Accommodation Platform', 40, 50);
    doc.fontSize(10)
      .text('BOOKING CONFIRMATION', doc.page.width - 200, 35, { width: 160, align: 'right' })
      .text(`#${booking.bookingId || booking._id}`, doc.page.width - 200, 50, { width: 160, align: 'right' });

    doc.fillColor(dark);

    // ── SUCCESS BADGE ───────────────────────────────────────────────
    doc.moveDown(3);
    doc.rect(40, 105, doc.page.width - 80, 50).fill(green).stroke(green);
    doc.fontSize(16).fillColor('white').font('Helvetica-Bold')
      .text('✓  Booking Confirmed! Your room is reserved.', 55, 120);
    doc.fillColor(dark);

    // ── BOOKING DETAILS TABLE ───────────────────────────────────────
    const tableTop = 175;
    doc.rect(40, tableTop, doc.page.width - 80, 26).fill(orange);
    doc.fontSize(12).fillColor('white').font('Helvetica-Bold')
      .text('BOOKING DETAILS', 55, tableTop + 7);
    doc.fillColor(dark);

    const col1 = 55, col2 = 280;
    const rows = [
      ['Booking ID', booking.bookingId || String(booking._id)],
      ['Status', 'CONFIRMED'],
      ['Booked On', new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
      ['Check-in Date', new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
      ['Duration', `${booking.duration} Month${booking.duration > 1 ? 's' : ''}`],
      ['Check-out', (() => {
        const d = new Date(booking.checkInDate);
        d.setMonth(d.getMonth() + booking.duration);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      })()],
    ];

    let rowY = tableTop + 32;
    rows.forEach(([label, value], i) => {
      const rowBg = i % 2 === 0 ? 'white' : light;
      doc.rect(40, rowY, doc.page.width - 80, 24).fill(rowBg);
      doc.fontSize(10).fillColor(gray).font('Helvetica').text(label, col1, rowY + 7);
      doc.fontSize(10).fillColor(dark).font('Helvetica-Bold').text(value, col2, rowY + 7);
      rowY += 24;
    });

    // ── PROPERTY DETAILS ────────────────────────────────────────────
    rowY += 16;
    doc.rect(40, rowY, doc.page.width - 80, 26).fill(orange);
    doc.fontSize(12).fillColor('white').font('Helvetica-Bold')
      .text('PROPERTY DETAILS', 55, rowY + 7);
    doc.fillColor(dark);
    rowY += 32;

    const propertyRows = [
      ['Property Name', room.title],
      ['Address', [room.address?.area, room.address?.city, room.address?.state].filter(Boolean).join(', ')],
      ['Room Type', (room.roomType || 'Room').toUpperCase()],
      ['Owner', owner?.name || 'Property Owner'],
      ['Owner Phone', owner?.phone || 'N/A'],
      ['Owner Email', owner?.email || 'N/A'],
    ];

    propertyRows.forEach(([label, value], i) => {
      const rowBg = i % 2 === 0 ? 'white' : light;
      doc.rect(40, rowY, doc.page.width - 80, 24).fill(rowBg);
      doc.fontSize(10).fillColor(gray).font('Helvetica').text(label, col1, rowY + 7);
      doc.fontSize(10).fillColor(dark).font('Helvetica-Bold').text(String(value || '—'), col2, rowY + 7);
      rowY += 24;
    });

    // ── PRICE BREAKDOWN ─────────────────────────────────────────────
    rowY += 16;
    doc.rect(40, rowY, doc.page.width - 80, 26).fill(orange);
    doc.fontSize(12).fillColor('white').font('Helvetica-Bold')
      .text('PRICE BREAKDOWN', 55, rowY + 7);
    doc.fillColor(dark);
    rowY += 32;

    const p = booking.pricing || {};
    const priceRows = [
      [`Monthly Rent × ${booking.duration}`, `₹${(p.monthlyRent * booking.duration || 0).toLocaleString('en-IN')}`],
      ['Security Deposit', `₹${(p.securityDeposit || 0).toLocaleString('en-IN')}`],
      ['Platform Fee (5%)', `₹${(p.platformFee || 0).toLocaleString('en-IN')}`],
      ['GST (18% on Platform Fee)', `₹${(p.tax || 0).toLocaleString('en-IN')}`],
    ];

    priceRows.forEach(([label, value], i) => {
      const rowBg = i % 2 === 0 ? 'white' : light;
      doc.rect(40, rowY, doc.page.width - 80, 24).fill(rowBg);
      doc.fontSize(10).fillColor(gray).font('Helvetica').text(label, col1, rowY + 7);
      doc.fontSize(10).fillColor(dark).font('Helvetica-Bold').text(value, col2, rowY + 7);
      rowY += 24;
    });

    // Total row
    doc.rect(40, rowY, doc.page.width - 80, 30).fill('#1A1A1A');
    doc.fontSize(13).fillColor('white').font('Helvetica-Bold')
      .text('TOTAL AMOUNT', col1, rowY + 8)
      .text(`₹${(p.totalAmount || 0).toLocaleString('en-IN')}`, col2, rowY + 8);
    rowY += 36;

    // ── GUEST DETAILS ───────────────────────────────────────────────
    rowY += 16;
    doc.rect(40, rowY, doc.page.width - 80, 26).fill(orange);
    doc.fontSize(12).fillColor('white').font('Helvetica-Bold')
      .text('GUEST DETAILS', 55, rowY + 7);
    doc.fillColor(dark);
    rowY += 32;

    const si = booking.seekerInfo || {};
    const guestRows = [
      ['Full Name', si.name || buyer?.name || '—'],
      ['Email', si.email || buyer?.email || '—'],
      ['Phone', si.phone || buyer?.phone || '—'],
    ];
    if (booking.specialRequests) {
      guestRows.push(['Special Requests', booking.specialRequests]);
    }

    guestRows.forEach(([label, value], i) => {
      const rowBg = i % 2 === 0 ? 'white' : light;
      doc.rect(40, rowY, doc.page.width - 80, 24).fill(rowBg);
      doc.fontSize(10).fillColor(gray).font('Helvetica').text(label, col1, rowY + 7);
      doc.fontSize(10).fillColor(dark).font('Helvetica-Bold').text(String(value || '—'), col2, rowY + 7);
      rowY += 24;
    });

    // ── IMPORTANT NOTES ─────────────────────────────────────────────
    rowY += 20;
    doc.rect(40, rowY, doc.page.width - 80, 1).fill('#DDDDDD');
    rowY += 10;
    doc.fontSize(9).fillColor(gray).font('Helvetica').text(
      '⚠️  Important: Please carry this confirmation email or show your Booking ID at check-in.\n' +
      '   Keep this document safe — it serves as your proof of booking.\n' +
      '   For cancellations or queries, contact support@messwallah.com',
      40, rowY, { width: doc.page.width - 80 }
    );

    // ── FOOTER ──────────────────────────────────────────────────────
    const footerY = doc.page.height - 50;
    doc.rect(0, footerY - 10, doc.page.width, 60).fill(orange);
    doc.fontSize(9).fillColor('white').font('Helvetica')
      .text('MESS WALLAH · Student Accommodation Platform · support@messwallah.com', 40, footerY, {
        width: doc.page.width - 80, align: 'center'
      });
    doc.fontSize(8).fillColor('white')
      .text(`Generated on ${new Date().toLocaleString('en-IN')} · Booking ID: ${booking.bookingId || booking._id}`, 40, footerY + 14, {
        width: doc.page.width - 80, align: 'center'
      });

    doc.end();
  });
};

module.exports = { generateBookingPDF };
