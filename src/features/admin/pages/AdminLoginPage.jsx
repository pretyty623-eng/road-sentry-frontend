import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../services/adminAuth.service';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rememberedUsername = adminAuthService.getRememberedUsername();
  const [username, setUsername] = useState(rememberedUsername);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedUsername));
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const cardRef = useRef(null);
  const redirectTo = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (adminAuthService.isAuthenticated()) {
      navigate(redirectTo, { replace: true });
      return;
    }
  }, [navigate, redirectTo]);

  const validateField = (field, value) => {
    if (field === 'username') {
      if (!value.trim()) {
        setUsernameError('Email atau Username wajib diisi');
        return false;
      }
      setUsernameError('');
      return true;
    }
    if (field === 'password') {
      if (!value) {
        setPasswordError('Kata sandi wajib diisi');
        return false;
      }
      if (value.length < 6) {
        setPasswordError('Kata sandi minimal 6 karakter');
        return false;
      }
      setPasswordError('');
      return true;
    }
    return true;
  };

  const shakeCard = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    setTimeout(() => {
      if (card) card.style.animation = '';
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const isUserValid = validateField('username', username);
    const isPassValid = validateField('password', password);
    
    if (!isUserValid || !isPassValid) {
      shakeCard();
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await adminAuthService.login({
        username,
        password,
        rememberUsername: rememberMe
      });

      if (result.success) {
        setShowSuccess(true);

        window.setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 1000);
      } else {
        setError(result.message);
        shakeCard();
        setIsLoading(false);
      }
    } catch {
      setError('Tidak dapat terhubung ke server. Pastikan backend dan database berjalan.');
      shakeCard();
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const email = prompt('Masukkan alamat email admin terdaftar Anda:');
    if (email && email.includes('@')) {
      alert(`Instruksi pemulihan kata sandi telah dikirim ke: ${email}`);
    } else if (email) {
      alert('Format email tidak valid. Silakan coba lagi.');
    }
  };

  const handleContactSupport = () => {
    alert('Silakan hubungi Administrator Sistem via email: support@roadsentry.id atau telepon: (021) 555-0199');
  };

  return (
    <div className="admin-login-page">
      <div className="grid-overlay"></div>
      <div className="glowing-circle circle-1"></div>
      <div className="glowing-circle circle-2"></div>

      <div className="login-container">
        <div className="login-card-wrapper" ref={cardRef}>
          <div className="card-brand-header">
            <div className="logo-container">
              <svg className="brand-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L90 30V70L50 90L10 70V30L50 10Z" stroke="url(#logo-grad)" strokeWidth="5" strokeLinejoin="round"/>
                <path d="M50 25L80 40V60L50 75L20 60V40L50 25Z" fill="url(#logo-grad)" fillOpacity="0.15" stroke="url(#logo-grad)" strokeWidth="2.5"/>
                <path d="M50 40V60" stroke="#00F2FE" strokeWidth="7" strokeLinecap="round"/>
                <circle cx="50" cy="31" r="4.5" fill="#10B981"/>
                <defs>
                  <linearGradient id="logo-grad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00F2FE"/>
                    <stop offset="1" stopColor="#4FACFE"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-info">
              <h1 className="brand-name">ROAD-<span>SENTRY</span></h1>
              <span className="badge">ADMIN PORTAL</span>
            </div>
          </div>

          <div className="login-header">
            <h2>Selamat Datang Kembali</h2>
            <p>Masukkan kredensial admin Anda untuk mengakses dashboard.</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <div className="alert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="alert-message">{error}</div>
              <button className="alert-close" onClick={() => setError('')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`input-group ${usernameError ? 'invalid' : ''}`}>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => validateField('username', username)}
                  className={username ? 'has-value' : ''}
                />
                <label htmlFor="username">Email atau Username</label>
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="input-line"></div>
              </div>
              {usernameError && <span className="validation-message visible">{usernameError}</span>}
            </div>

            <div className={`input-group ${passwordError ? 'invalid' : ''}`}>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validateField('password', password)}
                  className={password ? 'has-value' : ''}
                />
                <label htmlFor="password">Kata Sandi</label>
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
                <div className="input-line"></div>
              </div>
              {passwordError && <span className="validation-message visible">{passwordError}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="checkmark"></span>
                <span className="remember-text">Ingat Saya</span>
              </label>
              <a href="#" className="forgot-password-link" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                Lupa Kata Sandi?
              </a>
            </div>

            <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''} ${showSuccess ? 'success-state' : ''}`} disabled={isLoading}>
              {showSuccess ? (
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : isLoading ? (
                <div className="spinner"></div>
              ) : (
                <span className="btn-text">Masuk Sekarang</span>
              )}
            </button>
          </form>
              
          <div className="support-footer">
            <p>Mengalami kendala masuk? <a href="#" onClick={(e) => { e.preventDefault(); handleContactSupport(); }}>Hubungi IT Support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLoginPage;
