import React from 'react';

interface ARViewProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ARView: React.FC<ARViewProps> = ({ style, children }) => {
  return (
    <div style={{ 
      ...style, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '8px',
        background: 'rgba(0,0,0,0.1)',
        color: '#333',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        AR Simulation
      </div>
      <div style={{ marginTop: '24px' }}>
        {children}
      </div>
    </div>
  );
};
