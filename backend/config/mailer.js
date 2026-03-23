const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async ({ to, patientName, doctorName, date, time }) => {
  const mailOptions = {
    from: `"MediBook" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ Appointment Confirmed — MediBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #0f766e;">Your Appointment is Confirmed!</h2>
        <p>Hi <strong>${patientName}</strong>,</p>
        <p>Your appointment has been successfully booked. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr style="background: #f0fdf4;">
            <td style="padding: 10px; border: 1px solid #d1fae5;"><strong>Doctor</strong></td>
            <td style="padding: 10px; border: 1px solid #d1fae5;">Dr. ${doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #d1fae5;"><strong>Date</strong></td>
            <td style="padding: 10px; border: 1px solid #d1fae5;">${date}</td>
          </tr>
          <tr style="background: #f0fdf4;">
            <td style="padding: 10px; border: 1px solid #d1fae5;"><strong>Time</strong></td>
            <td style="padding: 10px; border: 1px solid #d1fae5;">${time}</td>
          </tr>
        </table>
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <p style="color: #6b7280; font-size: 13px;">If you need to cancel or reschedule, please log in to your MediBook account.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">© 2025 MediBook. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
