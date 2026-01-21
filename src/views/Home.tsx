import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{
      background: '#0a0a0f',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '48px',
          background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          ?? RezStack
        </h1>
        <p style={{ fontSize: '20px', color: '#9ca3af', marginBottom: '40px' }}>
          GPU-Aware AI Development Environment
        </p>
        
        <div style={{
          background: '#1e1e2e',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #374151',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#8b5cf6', marginBottom: '15px' }}>Features</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>? 15+ AI Models</li>
            <li style={{ marginBottom: '10px' }}>? GPU-Aware Routing</li>
            <li style={{ marginBottom: '10px' }}>? VRAM Optimization</li>
            <li style={{ marginBottom: '10px' }}>? Real-time Streaming</li>
            <li style={{ marginBottom: '10px' }}>? Code-Specialized Models</li>
          </ul>
        </div>

        <Link to='/ide' style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}>
          Launch IDE ?
        </Link>
        
        <div style={{ marginTop: '20px' }}>
          <Link to='/test' style={{
            display: 'inline-block',
            background: '#1e1e2e',
            color: '#9ca3af',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            border: '1px solid #374151'
          }}>
            Test Page
          </Link>
        </div>
      </div>
    </div>
  );
}
