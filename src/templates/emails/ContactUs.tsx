import React from 'react';

interface ContactUsProps {
  contact: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

const ContactUs: React.FC<ContactUsProps> = ({ contact }) => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: '1.6',
        color: '#333',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#FF9900',
          padding: '30px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src='/Icon.png'
            alt='Rakhi Studio Logo'
            width={80}
            height={80}
            style={{ borderRadius: '50%', display: 'block', margin: '0 auto' }}
          />
        </div>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '300', margin: '0 0 10px 0' }}>
          Thank You for Contacting Us
        </h1>
        <p style={{ fontSize: '16px', opacity: '0.9', margin: '0' }}>
          We have received your message and will get back to you soon!
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#FF9900', fontSize: '24px', marginBottom: '15px', margin: '0 0 15px 0' }}>
            Dear {contact.name},
          </h2>
          <p style={{ color: '#666', fontSize: '16px', margin: '0' }}>
            Thank you for reaching out to Rakhi Studio. We have received your message and our team will review it
            shortly. We appreciate your interest in our artwork and services.
          </p>
        </div>

        {/* Contact Details */}
        <div
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '25px',
            margin: '30px 0',
            borderLeft: '4px solid #FF9900',
          }}
        >
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '20px', margin: '0 0 20px 0' }}>
            📋 Your Contact Information
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e9ecef',
                    fontWeight: 600,
                    color: '#495057',
                    fontSize: '14px',
                    width: '40%',
                  }}
                >
                  Email:
                </td>
                <td
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e9ecef',
                    color: '#333',
                    fontSize: '14px',
                    textAlign: 'right',
                  }}
                >
                  {contact.email}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e9ecef',
                    fontWeight: 600,
                    color: '#495057',
                    fontSize: '14px',
                  }}
                >
                  Phone:
                </td>
                <td
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e9ecef',
                    color: '#333',
                    fontSize: '14px',
                    textAlign: 'right',
                  }}
                >
                  {contact.phone}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '8px 0',
                    fontWeight: 600,
                    color: '#495057',
                    fontSize: '14px',
                    verticalAlign: 'top',
                  }}
                >
                  Message:
                </td>
                <td style={{ padding: '8px 0', color: '#333', fontSize: '14px', textAlign: 'right' }}>
                  {contact.message}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Next Steps */}
        <div
          style={{
            backgroundColor: '#e7f3ff',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
          }}
        >
          <h4 style={{ color: '#0066cc', fontSize: '16px', marginBottom: '10px', margin: '0 0 10px 0' }}>
            📧 What Happens Next?
          </h4>
          <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
            Our team will review your message and get back to you within 24-48 hours. We will respond to your inquiry
            using the contact information you provided.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          textAlign: 'center',
          borderTop: '1px solid #e9ecef',
        }}
      >
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px', margin: '0 0 15px 0' }}>
          Best regards,
          <br />
          The Rakhi Studio Team
        </p>
        <div style={{ marginTop: '15px' }}>
          <a
            href='mailto:rakhistudio1010@gmail.com'
            style={{ color: '#FF9900', textDecoration: 'none', fontSize: '14px' }}
          >
            📧 rakhistudio1010@gmail.com
          </a>
        </div>
        <p style={{ marginTop: '20px', fontSize: '11px', color: '#999', margin: '20px 0 0 0' }}>
          © 2024 Rakhi Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
