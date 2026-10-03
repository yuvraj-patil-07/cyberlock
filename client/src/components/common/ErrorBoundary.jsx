import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('🛑 CYBERLOCK Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0d1a 0%, #1a0a2e 50%, #0a1a1a 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Press Start 2P', monospace",
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛡️💀</div>
          <h1 style={{ color: '#ff4757', fontSize: '1rem', marginBottom: '0.5rem', letterSpacing: '2px' }}>
            SYSTEM BREACH DETECTED
          </h1>
          <p style={{ color: '#8892a4', fontSize: '0.6rem', marginBottom: '2rem', maxWidth: '400px', lineHeight: '2' }}>
            An unexpected error has occurred. The security system has caught it safely.
            Your progress is not affected.
          </p>
          {this.state.error && (
            <pre style={{
              color: '#ff6b6b',
              fontSize: '0.5rem',
              background: 'rgba(255,71,87,0.1)',
              border: '1px solid rgba(255,71,87,0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              maxWidth: '500px',
              overflow: 'auto',
              textAlign: 'left',
              lineHeight: '1.6',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.href = '/dashboard';
            }}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              border: 'none',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.6rem',
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: '1px',
              marginRight: '1rem',
            }}
          >
            🏠 Return to Base
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'transparent',
              border: '1px solid #3d4f7c',
              color: '#8892a4',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.6rem',
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: '1px',
            }}
          >
            🔄 Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
