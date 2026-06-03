const AUTH_KEY = 'adminAuth';
const TOKEN_KEY = 'adminToken';
const USERNAME_KEY = 'adminUsername';
const ADMIN_PROFILE_KEY = 'adminProfile';
const LOGIN_TIME_KEY = 'adminLoginTime';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const isTokenExpired = (token) => {
  try {
    const payloadPart = token.split('.')[1];
    const normalizedPayload = payloadPart
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payloadPart.length / 4) * 4, '=');
    const payload = JSON.parse(atob(normalizedPayload));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const adminAuthService = {
  login: async ({ username, password, rememberUsername }) => {
    const normalizedUsername = username.trim();

    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalizedUsername, password })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Login gagal. Silakan coba lagi.'
      };
    }

    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(TOKEN_KEY, result.data.token);
    localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(result.data.admin));
    localStorage.setItem(LOGIN_TIME_KEY, new Date().toISOString());

    if (rememberUsername) {
      localStorage.setItem(USERNAME_KEY, normalizedUsername);
    } else {
      localStorage.removeItem(USERNAME_KEY);
    }

    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_PROFILE_KEY);
    localStorage.removeItem(LOGIN_TIME_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';

    if (!isAuthenticated || !token || isTokenExpired(token)) {
      adminAuthService.logout();
      return false;
    }

    return true;
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getRememberedUsername: () => localStorage.getItem(USERNAME_KEY) || ''
};
