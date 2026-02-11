import React, { useState, useEffect } from 'react';

const RTX3060VRAMonitor = () => {
  const [vramData, setVramData] = useState({
    used: 0,
    total: 12,
    percentage: 0,
    timestamp: new Date().toLocaleTimeString()
  });
  const [loading, setLoading] = useState(true);

  // Mock data generator for RTX 3060 (2-10GB typical for AI workloads)
  const generateVRAMData = () => {
    const used = Math.random() * 8 + 2; // 2-10 GB
    const percentage = (used / 12) * 100;
    return {
      used: Number(used.toFixed(1)),
      total: 12,
      percentage: Number(percentage.toFixed(1)),
      timestamp: new Date().toLocaleTimeString()
    };
  };

  useEffect(() => {
    // Initial data
    setVramData(generateVRAMData());
    setLoading(false);

    // Update every 2 seconds
    const interval = setInterval(() => {
      setVramData(generateVRAMData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (percent) => {
    if (percent < 70) return '#4ade80';
    if (percent < 85) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusText = (percent) => {
    if (percent < 70) return 'Optimal';
    if (percent < 85) return 'High Usage';
    return 'Critical';
  };

  if (loading) {
    return (
      <div style={{
        background: '#0f172a',
        color: '#e2e8f0',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        Loading VRAM data...
      </div>
    );
  }

  const statusColor = getStatusColor(vramData.percentage);
  const statusText = getStatusText(vramData.percentage);

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0f172a, #1e293b)',
      borderRadius: '16px',
      padding: '24px',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '400px',
      border: '1px solid #334155',
      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid #334155',
        paddingBottom: '16px'
      }}>
        <span style={{
          fontSize: '28px',
          background: '#0f172a',
          padding: '8px',
          borderRadius: '10px'
        }}>🎮</span>
        <div>
          <h3 style={{
            margin: 0,
            color: '#3b82f6',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            RTX 3060 VRAM
          </h3>
          <p style={{
            margin: '4px 0 0',
            color: '#94a3b8',
            fontSize: '12px'
          }}>
            12GB GDDR6 • Real-time
          </p>
        </div>
        <span style={{
          marginLeft: 'auto',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          background: `${statusColor}20`,
          color: statusColor,
          border: `1px solid ${statusColor}40`
        }}>
          {statusText}
        </span>
      </div>

      {/* VRAM Usage */}
      <div style={{
        background: '#0f172a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <span style={{ color: '#94a3b8' }}>Memory Usage</span>
          <span style={{
            color: statusColor,
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            {vramData.used} GB
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Used</span>
          <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{vramData.total} GB Total</span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '10px',
          background: '#1e293b',
          borderRadius: '5px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            width: `${vramData.percentage}%`,
            height: '100%',
            background: statusColor,
            transition: 'width 0.3s ease',
            boxShadow: `0 0 10px ${statusColor}`
          }} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#94a3b8',
          fontSize: '12px',
          marginTop: '4px'
        }}>
          <span>0 GB</span>
          <span>6 GB</span>
          <span>12 GB</span>
        </div>
      </div>

      {/* Status Message */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: `${statusColor}10`,
        border: `1px solid ${statusColor}30`,
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: statusColor,
            boxShadow: `0 0 8px ${statusColor}`,
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ color: statusColor, fontSize: '14px', fontWeight: '500' }}>
            {vramData.percentage < 70 ? 'Ready for AI workloads' :
             vramData.percentage < 85 ? 'Monitor recommended' :
             'Close other GPU applications'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#64748b',
        fontSize: '11px',
        borderTop: '1px solid #334155',
        paddingTop: '16px'
      }}>
        <span>🕐 Last updated: {vramData.timestamp}</span>
        <span style={{ color: '#3b82f6' }}>⚡ {vramData.percentage}%</span>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default RTX3060VRAMonitor;
