import { internalCSSTemplate, logoTemplate, footerTemplate } from './helpers';

export const orderReceiverTemplate = (order: {
  _id: string;
  user: { name: string; email: string; phone: string };
  createdAt: string;
  paintingId?: string;
  customSize?: string;
  customMessage?: string;
  url?: string;
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
  <title>New Order Received - Rakhi Studio</title>
  ${internalCSSTemplate}
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      
      <!-- Logo -->
      ${logoTemplate}

      <!-- Content -->
      <div class="email-body">
        <div class="email-header">
          <h1>🔔 New Order Received</h1>
          <p>A new painting order has been placed!</p>
        </div>

        <h2>Hello Team,</h2>
        <p>
          A new painting order has been received on Rakhi Studio. Please review the details below and take necessary action.
        </p>

        <!-- Order Details -->
        <div class="details-box">
          <h3>📋 Order Details</h3>
          <table>
            <tr>
              <td>Order ID:</td>
              <td>${order._id}</td>
            </tr>
            <tr>
              <td>Order Date:</td>
              <td>${orderDate}</td>
            </tr>
            <tr>
              <td>Customer Name:</td>
              <td>${order.user.name}</td>
            </tr>
            <tr>
              <td>Customer Email:</td>
              <td>${order.user.email}</td>
            </tr>
            <tr>
              <td>Customer Phone:</td>
              <td>${order.user.phone}</td>
            </tr>
            ${customSizeRow}
            ${customMessageRow}
          </table>
        </div>

        <!-- Painting Image -->
        ${
          order.paintingId
            ? `
        <div style="text-align: center; margin: 30px 0;">
          <h3 style="color: #333; margin-bottom: 15px;">🎨 Ordered Painting</h3>
          <img 
            src="${order.url}" 
            alt="Ordered Painting" 
            style="max-width: 300px; max-height: 200px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; align-items: center; display: block; margin: 0 auto"
          />
          <p style="color: #666; font-size: 14px; margin-top: 10px;">
            Painting ID: ${order.paintingId}
          </p>
        </div>
        `
            : ''
        }

        <!-- Action Required -->
        <div class="info-box">
          <h4>⚠️ Action Required</h4>
          <p>
            Please review this order and contact the customer within 24-48 hours with pricing and timeline details.
          </p>
        </div>

        <p>
          You can manage this order from your admin dashboard. If you have any questions, please check the order details in the system.
        </p>
        <br>
        <p>Best regards,<br />
        <strong>Rakhi Studio System</strong></p>
      </div>

      <!-- Footer -->
      ${footerTemplate}

    </div>
  </div>
</body>
</html>
`;
};
