import { internalCSSTemplate, logoTemplate, bannerTemplate, footerTemplate } from './helpers';

export const paintingOrderConfirmationTemplate = (order: {
  _id: string;
  user: { name: string; email: string; phone: string };
  createdAt: string;
  customSize?: string;
  customMessage?: string;
}) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let customSizeRow = '';
  if (order.customSize) {
    customSizeRow = `
      <tr>
        <td>Custom Size:</td>
        <td>${order.customSize}</td>
      </tr>
    `;
  }

  let customMessageRow = '';
  if (order.customMessage) {
    customMessageRow = `
      <tr>
        <td style="vertical-align: top;">Message:</td>
        <td>${order.customMessage}</td>
      </tr>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation - Rakhi Studio</title>
  ${internalCSSTemplate}
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      
      <!-- Logo -->
      ${logoTemplate}

      <!-- Banner -->
      ${bannerTemplate}

      <!-- Content -->
      <div class="email-body">
        <h2>Hi ${order.user.name},</h2>
        <p>
          We are delighted to confirm that we have received your painting order. Your request for the artwork has been successfully submitted and is now being reviewed by our team.
        </p>

        <!-- Order Details -->
        <div class="details-box">
          <h3>📋 Order Details</h3>
          <table>
            <tr>
              <td>Order Date:</td>
              <td>${orderDate}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${order.user.email}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>${order.user.phone}</td>
            </tr>
            ${customSizeRow}
            ${customMessageRow}
          </table>
        </div>

        <!-- Painting Information -->
        <div class="info-box">
          <h4>🎨 Painting Information</h4>
          <p>
            We have received your request for the painting and will provide you with detailed information including pricing, dimensions, and estimated completion time within 24-48 hours.
          </p>
        </div>

        <!-- Next Steps -->
        <div class="next-steps">
          <h3>📝 What Happens Next?</h3>
          <ul>
            <li>Our team will review your order and painting details</li>
            <li>You will receive a detailed quote within 24-48 hours</li>
            <li>Upon confirmation, we will begin the painting process</li>
            <li>You will receive updates on the progress of your artwork</li>
            <li>Final delivery arrangements will be made upon completion</li>
          </ul>
        </div>

        <p>
          If you have any questions about your order, please feel free to contact us at 
          <a href="mailto:rakhistudio1010@gmail.com">rakhistudio1010@gmail.com</a>.
        </p>
        <br>
        <p>Best regards,<br />
        <strong>The Rakhi Studio Team</strong></p>
      </div>

      <!-- Footer -->
      ${footerTemplate}

    </div>
  </div>
</body>
</html>
`;
};
