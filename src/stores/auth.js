import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const isAuthenticated = ref(false);
  const authError = ref('');

  // Getters (computed)
  const userName = computed(() => user.value?.username || '');
  const userEmail = computed(() => user.value?.email || '');

  // Actions
  function login(credentials) {
    try {
      // Clear previous errors
      authError.value = '';

      // Simple validation
      if (credentials.username && credentials.password.length >= 8) {
        user.value = {
          id: Date.now(),
          username: credentials.username,
          email: credentials.email || `${credentials.username}@example.com`,
          loginTime: new Date().toISOString(),
        };
        isAuthenticated.value = true;

        // Store in localStorage for persistence
        localStorage.setItem('portphelia_user', JSON.stringify(user.value));
        localStorage.setItem('portphelia_authenticated', 'true');

        // Redirect to design page
        window.location.href = '/design';
        return true;
      } else {
        authError.value = 'Invalid username or password';
        return false;
      }
    } catch (error) {
      authError.value = 'Login failed. Please try again.';
      console.error('Login error:', error);
      return false;
    }
  }

  function register(userData) {
    try {
      // Clear previous errors
      authError.value = '';

      // Simple validation
      if (
        userData.username &&
        userData.email &&
        userData.password.length >= 8
      ) {
        user.value = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          registrationTime: new Date().toISOString(),
        };
        isAuthenticated.value = true;

        // Store in localStorage for persistence
        localStorage.setItem('portphelia_user', JSON.stringify(user.value));
        localStorage.setItem('portphelia_authenticated', 'true');

        // Redirect to design page
        window.location.href = '/design';
        return true;
      } else {
        authError.value = 'Registration failed. Please check your information.';
        return false;
      }
    } catch (error) {
      authError.value = 'Registration failed. Please try again.';
      console.error('Registration error:', error);
      return false;
    }
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
    authError.value = '';

    // Clear localStorage
    localStorage.removeItem('portphelia_user');
    localStorage.removeItem('portphelia_authenticated');

    // Redirect to home page
    window.location.href = '/index';
  }

  function initializeAuth() {
    // Check localStorage on app initialization
    const storedUser = localStorage.getItem('portphelia_user');
    const storedAuth = localStorage.getItem('portphelia_authenticated');

    if (storedUser && storedAuth === 'true') {
      try {
        user.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout(); // Clear invalid data
      }
    }
  }

  function checkAuthAndRedirect() {
    // If user is already authenticated, redirect to design page
    if (isAuthenticated.value) {
      window.location.href = '/design';
      return true;
    }
    return false;
  }

  function requireAuth() {
    // Redirect to sign in if not authenticated
    if (!isAuthenticated.value) {
      window.location.href = '/signin';
      return false;
    }
    return true;
  }

  function clearError() {
    authError.value = '';
  }

  // Initialize auth state when store is created
  initializeAuth();

  return {
    // State
    user,
    isAuthenticated,
    authError,

    // Getters
    userName,
    userEmail,

    // Actions
    login,
    register,
    logout,
    initializeAuth,
    checkAuthAndRedirect,
    requireAuth,
    clearError,
  };
});
