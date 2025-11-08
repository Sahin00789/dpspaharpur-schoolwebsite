import React from 'react';
import { Result, Button, Typography, Card, Row, Col } from 'antd';
import { LockOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Unauthorized = () => {
  return (
    <div className="unauthorized-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Card style={{ maxWidth: 800, width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <LockOutlined style={{ fontSize: '80px', color: '#ff4d4f' }} />
            </div>
            <Title level={2} style={{ color: '#ff4d4f' }}>Access Denied</Title>
            <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '24px' }}>
              You don't have permission to access this page. Please contact the administrator if you believe this is an error.
            </Text>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button type="primary" icon={<HomeOutlined />}>
                <Link to="/">Back to Home</Link>
              </Button>
              <Button icon={<LoginOutlined />}>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <img 
              src="/images/unauthorized.svg" 
              alt="Unauthorized Access" 
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0ODAgNDgwIiBmaWxsPSJub25lIj48cGF0aCBkPSJNMjQwIDQ4QzxzcGFuIGNsYXNzPSJhbmltYXRlLWZpbGwiIHN0eWxlPSJhbmltYXRpb246IGZpbGwgMC41cyBlYXNlIDBzIG5vcm1hbCBib3RoOyI+CjE0MC4xIDQ0Qzc4LjIgNDQgMzIgOTAuMiAzMiAxNTJ2MTc2YzAgNjEuOSA0Ni4yIDExMiAxMDQuMSAxMTJoMTU5LjdjMjIuMSAzOC4xIDYzLjUgNjQgMTEyLjIgNjRjNzAuNyAwAxI48L3NwYW4+IiBmaWxsPSIjZmY0ZDRmIiBzdHJva2U9IiNmZjRkNGYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'
              }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Unauthorized;
