import { internalCSSTemplate, logoTemplate, contactBannerTemplate, contactFooterTemplate } from './helpers';

export const contactUsTemplate = (contact: { name: string; email: string; phone: string; message: string }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Contacting Us - Rakhi Studio</title>
  ${internalCSSTemplate}
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      
      <!-- Logo -->
      ${logoTemplate}

      <!-- Banner -->
      ${contactBannerTemplate}

      <!-- Content -->
      <div class="email-body">
        <h2>Hi ${contact.name},</h2>
        <p>
          Thank you for reaching out to Rakhi Studio. We have received your message and our team will review it shortly. We appreciate your interest in our artwork and services.
        </p>

        <!-- Contact Details -->
        <div class="details-box">
          <h3>📋 Your Contact Information</h3>
          <table>
            <tr>
              <td>Email:</td>
              <td>${contact.email}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>${contact.phone}</td>
            </tr>
            <tr>
              <td style="vertical-align: top;">Message:</td>
              <td>${contact.message}</td>
            </tr>
          </table>
        </div>

        <!-- What Happens Next -->
        <div class="info-box" style="background-color: #e7f3ff; border: none;">
          <h4 style="color: #0066cc;">📧 What Happens Next?</h4>
          <p style="color: #666;">
            Our team will review your message and get back to you within 24-48 hours. We will respond to your inquiry using the contact information you provided.
          </p>
        </div>

        <p>
          If you have any urgent questions, please feel free to contact us directly at 
          <a href="mailto:rakhistudio1010@gmail.com">rakhistudio1010@gmail.com</a>.
        </p>
        <br>
        <p>Thank you for choosing Rakhi Studio!</p>
      </div>

      <!-- Footer -->
      ${contactFooterTemplate}

    </div>
  </div>
</body>
</html>
`;
};
