import React from 'react';

export default function TestPage() {
  return (
    <div style={{
      background: '#0a0a0f',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
      <h1>?? Test Page</h1>
      <p>This is a test page for RezStack</p>
      <div style={{
        background: '#1e1e2e',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Status</h2>
        <p>? React is working</p>
        <p>? Routing is working</p>
        <p>? Styling is working</p>
      </div>
    </div>
  );
}
