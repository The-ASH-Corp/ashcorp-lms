export const resentOTPTemplate = (targetName: string, otp: string, otpExpiryMinutes: number) => {
  return `
  <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset</title>
</head>

<body style="margin:0;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table
width="600"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:16px;
overflow:hidden;
box-shadow:0 8px 30px rgba(0,0,0,.08);
">

<!-- Header -->
<tr>
<td
align="center"
style="
background:#7C3AED;
padding:32px;
">
<h1
style="
margin:0;
color:#ffffff;
font-size:28px;
font-weight:700;
">
Ashcorp Technologies LMS
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<h2
style="
margin-top:0;
color:#111827;
font-size:24px;
">
Password Reset Request
</h2>

<p
style="
font-size:16px;
line-height:26px;
color:#4B5563;
margin-bottom:24px;
">
Hello <strong>${targetName}</strong>,
</p>

<p
style="
font-size:16px;
line-height:26px;
color:#4B5563;
">
We received a request to reset your password.
Use the verification code below to continue.
</p>

<!-- OTP Box -->
<table
align="center"
cellpadding="0"
cellspacing="0"
style="
margin:32px auto;
">
<tr>
<td
style="
background:#F5F3FF;
border:2px dashed #7C3AED;
border-radius:12px;
padding:18px 36px;
text-align:center;
">
<div
style="
font-size:36px;
font-weight:700;
letter-spacing:8px;
color:#7C3AED;
">
${otp}
</div>
</td>
</tr>
</table>

<p
style="
text-align:center;
font-size:14px;
color:#6B7280;
margin-top:0;
">
This OTP will expire in
<strong>${otpExpiryMinutes} minutes</strong>.
</p>

<hr
style="
border:none;
border-top:1px solid #E5E7EB;
margin:32px 0;
">

<p
style="
font-size:15px;
line-height:24px;
color:#6B7280;
">
If you didn't request this password reset,
you can safely ignore this email.
Your password will remain unchanged.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td
style="
background:#FAFAFA;
padding:24px;
text-align:center;
">

<p
style="
margin:0;
font-size:13px;
color:#9CA3AF;
">
© ${new Date().getFullYear()} Ashcorp Technologies LMS
</p>

<p
style="
margin-top:8px;
font-size:13px;
color:#9CA3AF;
">
This is an automated email. Please do not reply.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
}


export const mailTemplateForExamPassed =({
  studentName,
  studentEmail,
  score,
  totalMarks,
  percentage,
  examTitle,
  passMarks,
  courseId,
  attemptedAtText
}:{
  studentName: string,
  studentEmail: string,
  score: number,
  totalMarks: number,
  percentage: number,
  examTitle: string,
  passMarks: number,
  courseId: string,
  attemptedAtText: string
})=>{
  return`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exam Result</title>
</head>

<body style="margin:0;padding:40px 20px;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table
width="640"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:20px;
overflow:hidden;
box-shadow:0 12px 40px rgba(0,0,0,.08);
">

<!-- Hero -->

<tr>
<td
style="
padding:45px;
background:linear-gradient(135deg,#7C3AED,#9333EA);
text-align:center;
">

<div
style="
width:80px;
height:80px;
background:#ffffff;
border-radius:50%;
line-height:80px;
font-size:42px;
margin:0 auto 20px;
">
🏆
</div>

<h1
style="
margin:0;
font-size:32px;
color:#ffffff;
font-weight:700;
">
Exam Successfully Passed
</h1>

<p
style="
margin:14px 0 0;
font-size:16px;
color:#E9D5FF;
">
The student has successfully completed the examination.
</p>

</td>
</tr>

<!-- Student -->

<tr>
<td style="padding:35px 40px;">

<p
style="
margin:0;
font-size:15px;
color:#6B7280;
">
Student
</p>

<h2
style="
margin:6px 0 4px;
font-size:28px;
color:#111827;
">
${studentName}
</h2>

<p
style="
margin:0;
font-size:16px;
color:#7C3AED;
">
${studentEmail}
</p>

</td>
</tr>

<!-- Score -->

<tr>
<td style="padding:0 40px 40px;">

<table width="100%" cellpadding="0" cellspacing="0">

<tr>

<td
width="48%"
style="
background:#7C3AED;
padding:30px;
border-radius:16px;
text-align:center;
">

<p
style="
margin:0;
font-size:14px;
color:#DDD6FE;
text-transform:uppercase;
">
Score
</p>

<h1
style="
margin:12px 0;
font-size:44px;
color:#ffffff;
">
${score}/${totalMarks}
</h1>

<p
style="
margin:0;
font-size:18px;
color:#F5F3FF;
">
${percentage}%
</p>

</td>

<td width="4%"></td>

<td
width="48%"
style="
background:#F8FAFC;
border:1px solid #E5E7EB;
border-radius:16px;
padding:25px;
">

<table width="100%">

<tr>
<td style="padding:8px 0;color:#6B7280;">Exam</td>
<td align="right" style="font-weight:bold;color:#111827;">
${examTitle}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#6B7280;">Pass Mark</td>
<td align="right" style="font-weight:bold;color:#111827;">
${passMarks}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#6B7280;">Course</td>
<td align="right" style="font-weight:bold;color:#111827;">
${courseId}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#6B7280;">Attempted</td>
<td align="right" style="font-weight:bold;color:#111827;">
${attemptedAtText}
</td>
</tr>

</table>

</td>

</tr>

</table>

</td>
</tr>

<!-- Bottom Banner -->

<tr>

<td
style="
padding:30px 40px;
background:#F5F3FF;
border-top:1px solid #E9D5FF;
">

<table width="100%">

<tr>

<td>

<h3
style="
margin:0;
color:#7C3AED;
font-size:20px;
">
🎉 Congratulations!
</h3>

<p
style="
margin:10px 0 0;
font-size:15px;
color:#4B5563;
line-height:24px;
">
The student has achieved a passing score and is eligible for the next stage of the course.
</p>

</td>

</tr>

</table>

</td>

</tr>

<!-- Footer -->

<tr>

<td
style="
padding:24px;
background:#111827;
text-align:center;
">

<p
style="
margin:0;
font-size:13px;
color:#D1D5DB;
">
Generated automatically by <strong>Your LMS</strong>
</p>

<p
style="
margin:8px 0 0;
font-size:12px;
color:#9CA3AF;
">
© ${new Date().getFullYear()} All Rights Reserved
</p>

</td>

</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
}

export const mailTemplateForInquirySubmitted = ({
  fullName,
  email,
  phone,
  subject,
  message,
}: {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  const submittedAt = new Date().toISOString();

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Inquiry Submitted</title>
</head>
<body style="margin:0;padding:32px 16px;background:#F8FAFC;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#7C3AED,#9333EA);color:#ffffff;">
              <h1 style="margin:0;font-size:24px;">New Contact Inquiry</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#E9D5FF;">A new inquiry has been submitted from the website contact form.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#334155;line-height:1.6;">
                <tr><td style="padding:6px 0;"><strong>Name:</strong> ${fullName}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Email:</strong> ${email}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Phone:</strong> ${phone}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Subject:</strong> ${subject}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Submitted At:</strong> ${submittedAt}</td></tr>
              </table>
              <div style="margin-top:16px;padding:14px;border-radius:10px;background:#F8FAFC;border:1px solid #E2E8F0;color:#334155;white-space:pre-wrap;">
                ${message}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
