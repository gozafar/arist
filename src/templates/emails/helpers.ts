// Email Template Helpers for Rakhi Studio

export const internalCSSTemplate = `
<style>
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
  }
  .email-wrapper {
    max-width: 600px;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .email-container {
    width: 100%;
  }
  .email-header {
    background: #FF9900;
    padding: 30px;
    text-align: center;
    color: white;
  }
  .email-header h1 {
    font-size: 28px;
    margin-bottom: 10px;
    font-weight: 300;
    margin: 0 0 10px 0;
  }
  .email-header p {
    font-size: 16px;
    opacity: 0.9;
    margin: 0;
  }
  .email-body {
    padding: 40px 30px;
  }
  .email-body h2 {
    color: #FF9900;
    font-size: 24px;
    margin-bottom: 15px;
    margin: 0 0 15px 0;
  }
  .email-body h3 {
    color: #333;
    font-size: 18px;
    margin-bottom: 15px;
    margin: 0 0 15px 0;
  }
  .email-body h4 {
    color: #856404;
    font-size: 16px;
    margin-bottom: 10px;
    margin: 0 0 10px 0;
  }
  .email-body p {
    color: #666;
    font-size: 16px;
    margin: 0 0 15px 0;
  }
  .details-box {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 25px;
    margin: 30px 0;
    border-left: 4px solid #FF9900;
  }
  .details-box table {
    width: 100%;
    border-collapse: collapse;
  }
  .details-box td {
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
    font-size: 14px;
  }
  .details-box td:first-child {
    font-weight: 600;
    color: #495057;
    width: 40%;
  }
  .details-box td:last-child {
    color: #333;
    text-align: right;
  }
  .info-box {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .info-box h4 {
    color: #856404;
    font-size: 16px;
    margin-bottom: 10px;
    margin: 0 0 10px 0;
  }
  .info-box p {
    color: #856404;
    font-size: 14px;
    margin: 0;
  }
  .next-steps {
    margin: 30px 0;
  }
  .next-steps ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .next-steps li {
    padding: 10px 0 10px 30px;
    position: relative;
    color: #666;
    font-size: 14px;
  }
  .next-steps li:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #28a745;
    font-weight: bold;
  }
  .email-footer {
    background-color: #f8f9fa;
    padding: 30px;
    text-align: center;
    border-top: 1px solid #e9ecef;
  }
  .email-footer p {
    color: #666;
    font-size: 12px;
    margin: 0 0 10px 0;
  }
  .email-footer a {
    margin: 0 10px;
    color: #FF9900;
    text-decoration: none;
    font-size: 14px;
  }
  .social-links {
    margin-top: 15px;
  }
  .copyright {
    margin-top: 20px;
    font-size: 11px;
    color: #999;
  }
</style>
`;

export const logoTemplate = `
<div class="email-logo" style="text-align: center; margin-bottom: 20px;">
  <img 
    src="/Icon.png" 
    alt="Rakhi Studio Logo" 
    width="80" 
    height="80" 
    style="border-radius: 50%; display: block; margin: 0 auto;"
  />
</div>
`;

export const bannerTemplate = `
<div class="email-header">
  <h1>Order Confirmation</h1>
  <p>Thank you for your interest in our artwork!</p>
</div>
`;

export const contactBannerTemplate = `
<div class="email-header">
  <h1>Thank You for Contacting Us</h1>
  <p>We have received your message and will get back to you soon!</p>
</div>
`;

export const footerTemplate = `
<div class="email-footer">
  <p><strong>Rakhi Studio</strong> - Where Art Comes to Life</p>
  <p>Creating beautiful artwork that inspires and delights</p>
  <div class="social-links">
    <a href="https://www.rakhistudio.com" target="_blank" rel="noopener noreferrer">Website</a>
    | 
    <a href="https://instagram.com/rakhistudio" target="_blank" rel="noopener noreferrer">Instagram</a>
    | 
    <a href="https://facebook.com/rakhistudio" target="_blank" rel="noopener noreferrer">Facebook</a>
  </div>
  <p class="copyright">This is an automated message. Please do not reply to this email.</p>
  <p class="copyright">© 2024 Rakhi Studio. All rights reserved.</p>
</div>
`;

export const contactFooterTemplate = `
<div class="email-footer">
  <p style="font-size: 14px; margin-bottom: 15px;">
    Best regards,<br />
    The Rakhi Studio Team
  </p>
  <div class="social-links">
    <a href="mailto:rakhistudio1010@gmail.com">📧 rakhistudio1010@gmail.com</a>
  </div>
  <p class="copyright">© 2024 Rakhi Studio. All rights reserved.</p>
</div>
`;
