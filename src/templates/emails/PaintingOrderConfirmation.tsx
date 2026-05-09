import React from 'react';

interface PaintingOrderConfirmationProps {
  order: {
    _id: string;
    user: { name: string; email: string; phone: string };
    createdAt: string;
    customSize?: string;
    customMessage?: string;
  };
}

const PaintingOrderConfirmation: React.FC<PaintingOrderConfirmationProps> = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
            src='https://res.cloudinary.com/dvtmoopfw/image/upload/v1778332918/image_7_Vectorized_tcypnm.svg'
            alt='Rakhi Studio Logo'
            width={80}
            height={80}
            style={{ borderRadius: '50%', display: 'block', margin: '0 auto' }}
          />
        </div>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '300', margin: '0 0 10px 0' }}>
          Order Confirmation
        </h1>
        <p style={{ fontSize: '16px', opacity: '0.9', margin: '0' }}>Thank you for your interest in our artwork!</p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#FF9900', fontSize: '24px', marginBottom: '15px', margin: '0 0 15px 0' }}>
            Dear {order.user.name},
          </h2>
          <p style={{ color: '#666', fontSize: '16px', margin: '0' }}>
            We are delighted to confirm that we have received your painting order. Your request for the artwork has been
            successfully submitted and is now being reviewed by our team.
          </p>
        </div>

        {/* Order Details */}
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
            📋 Order Details
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
                  Order Date:
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
                  {orderDate}
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
                  {order.user.email}
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
                  {order.user.phone}
                </td>
              </tr>
              {order.customSize && (
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
                    Custom Size:
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
                    {order.customSize}
                  </td>
                </tr>
              )}
              {order.customMessage && (
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
                    {order.customMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Painting Information */}
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
          }}
        >
          <h4 style={{ color: '#856404', fontSize: '16px', marginBottom: '10px', margin: '0 0 10px 0' }}>
            🎨 Painting Information
          </h4>
          <p style={{ color: '#856404', fontSize: '14px', margin: '0' }}>
            We have received your request for the painting and will provide you with detailed information including
            pricing, dimensions, and estimated completion time within 24-48 hours.
          </p>
        </div>

        {/* Next Steps */}
        <div style={{ margin: '30px 0' }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '15px', margin: '0 0 15px 0' }}>
            📝 What Happens Next?
          </h3>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            <li style={{ padding: '10px 0', position: 'relative', color: '#666', fontSize: '14px' }}>
              <span style={{ position: 'absolute', left: '0', color: '#28a745', fontWeight: 'bold' }}>✓</span>
              Our team will review your order and painting details
            </li>
            <li style={{ padding: '10px 0', position: 'relative', color: '#666', fontSize: '14px' }}>
              <span style={{ position: 'absolute', left: '0', color: '#28a745', fontWeight: 'bold' }}>✓</span>
              You will receive a detailed quote within 24-48 hours
            </li>
            <li style={{ padding: '10px 0', position: 'relative', color: '#666', fontSize: '14px' }}>
              <span style={{ position: 'absolute', left: '0', color: '#28a745', fontWeight: 'bold' }}>✓</span>
              Upon confirmation, we will begin the painting process
            </li>
            <li style={{ padding: '10px 0', position: 'relative', color: '#666', fontSize: '14px' }}>
              <span style={{ position: 'absolute', left: '0', color: '#28a745', fontWeight: 'bold' }}>✓</span>
              You will receive updates on the progress of your artwork
            </li>
            <li style={{ padding: '10px 0', position: 'relative', color: '#666', fontSize: '14px' }}>
              <span style={{ position: 'absolute', left: '0', color: '#28a745', fontWeight: 'bold' }}>✓</span>
              Final delivery arrangements will be made upon completion
            </li>
          </ul>
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
        <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px', margin: '0 0 10px 0' }}>
          <strong>Rakhi Studio</strong> - Where Art Comes to Life
        </p>
        <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px', margin: '0 0 10px 0' }}>
          Creating beautiful artwork that inspires and delights
        </p>
        <div style={{ marginTop: '15px' }}>
          <a
            href='https://www.rakhistudio.com'
            target='_blank'
            rel='noopener noreferrer'
            style={{ margin: '0 10px', color: '#FF9900', textDecoration: 'none', fontSize: '14px' }}
          >
            Website
          </a>{' '}
          |
          <a
            href='https://instagram.com/rakhistudio'
            target='_blank'
            rel='noopener noreferrer'
            style={{ margin: '0 10px', color: '#FF9900', textDecoration: 'none', fontSize: '14px' }}
          >
            Instagram
          </a>{' '}
          |
          <a
            href='https://facebook.com/rakhistudio'
            target='_blank'
            rel='noopener noreferrer'
            style={{ margin: '0 10px', color: '#FF9900', textDecoration: 'none', fontSize: '14px' }}
          >
            Facebook
          </a>
        </div>
        <p style={{ marginTop: '20px', fontSize: '11px', color: '#999', margin: '20px 0 0 0' }}>
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  );
};

export default PaintingOrderConfirmation;
