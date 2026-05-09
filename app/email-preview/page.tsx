import React from 'react';
import { paintingOrderConfirmationTemplate } from '../../src/templates/emails/PaintingOrderConfirmationTemplate';
import { contactUsTemplate } from '../../src/templates/emails/ContactUsTemplate';
import { orderReceiverTemplate } from '../../src/templates/emails/OrderReceiverTemplate';

// Sample order data for preview
const sampleOrder = {
  _id: '507f1f77bcf86cd799439011',
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  },
  createdAt: new Date().toISOString(),
  paintingId: 'sample-painting-123',
  customSize: '24x36 inches',
  customMessage: 'Looking for a custom landscape painting for my living room',
  url: 'https://picsum.photos/seed/rakhi-painting/300/200.jpg',
};

// Sample contact data for preview
const sampleContact = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '+1 (555) 987-6543',
  message: 'I am interested in commissioning a portrait painting. Please let me know about your process and pricing.',
};

export default function EmailPreviewPage() {
  const paintingOrderHTML = paintingOrderConfirmationTemplate(sampleOrder);
  const contactUsHTML = contactUsTemplate(sampleContact);
  const orderReceiverHTML = orderReceiverTemplate(sampleOrder);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Email Template Preview</h1>
        <p style={{ color: '#666' }}>Preview of all modular HTML email templates</p>
      </div>

      {/* Painting Order Confirmation */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FF9900', marginBottom: '5px' }}>🎨 Painting Order Confirmation</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Sent when a customer places a painting order</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: paintingOrderHTML }} />
      </div>

      {/* Order Receiver Notification */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FF9900', marginBottom: '5px' }}>🔔 Order Receiver Notification</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Sent to admin when new order is received</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: orderReceiverHTML }} />
      </div>

      {/* Contact Us */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FF9900', marginBottom: '5px' }}>📧 Contact Us Confirmation</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Sent when someone submits the contact form</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: contactUsHTML }} />
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Preview URL:{' '}
          <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>
            http://localhost:3000/email-preview
          </code>
        </p>
      </div>
    </div>
  );
}
