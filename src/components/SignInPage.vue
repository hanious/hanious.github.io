<template>
  <div class="signin-page">
    <NavMenu />
    <div class="signin-form-container">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <div class="signin-form-card">
              <div class="row">
                <div class="col-12">
                  <h2 class="form-title text-center mb-4">Sign In</h2>
                </div>
              </div>

              <form @submit.prevent="handleSubmit">
                <!-- Username Field -->
                <div class="row mb-3">
                  <div class="col-12">
                    <label for="username" class="form-label">Username</label>
                    <input
                      type="text"
                      class="form-control signin-input"
                      :class="{
                        'error-input': hasError('username'),
                        'valid-input': isFieldValid('username'),
                      }"
                      id="username"
                      v-model="formData.username"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <!-- Password Field -->
                <div class="row mb-4">
                  <div class="col-12">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control signin-input"
                      :class="{
                        'error-input': hasError('password'),
                        'valid-input': isFieldValid('password'),
                      }"
                      id="password"
                      v-model="formData.password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="row">
                  <div class="col-12">
                    <div class="d-grid">
                      <button
                        type="submit"
                        class="btn signin-btn"
                        :disabled="!isFormValid"
                        :class="{ 'disabled-btn': !isFormValid }"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Sign Up Link -->
                <div class="row mt-3">
                  <div class="col-12 text-center">
                    <p class="signup-link">
                      Don't have an account?
                      <a href="/signup" class="link-text">Sign Up</a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import NavMenu from './menu/NavMenu.vue';
  import { ref, computed, watch, onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';

  const authStore = useAuthStore();

  // Check if user is already logged in and redirect
  onMounted(() => {
    authStore.checkAuthAndRedirect();
  });

  const formData = ref({
    username: '',
    password: '',
  });

  const errors = ref([]);

  // Username validation function
  const validateUsername = () => {
    const username = formData.value.username.trim();
    if (!username) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    return null;
  };

  const validatePassword = () => {
    const password = formData.value.password;
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return null;
  };

  // Update errors array
  const updateErrors = () => {
    errors.value = [];

    const usernameError = validateUsername();
    const passwordError = validatePassword();

    if (usernameError)
      errors.value.push({ field: 'username', message: usernameError });
    if (passwordError)
      errors.value.push({ field: 'password', message: passwordError });
  };

  // Check if specific field has error
  const hasError = fieldName => {
    return errors.value.some(error => error.field === fieldName);
  };

  // Check if specific field is valid (has content and no errors)
  const isFieldValid = fieldName => {
    const fieldValue = formData.value[fieldName];
    return fieldValue && fieldValue.trim() && !hasError(fieldName);
  };

  // Computed property to check if form is valid
  const isFormValid = computed(() => {
    return (
      errors.value.length === 0 &&
      formData.value.username &&
      formData.value.password
    );
  });

  // Watch form data changes and update errors
  watch(formData, updateErrors, { deep: true });

  const handleSubmit = () => {
    updateErrors();
    if (isFormValid.value) {
      console.log('Sign in submitted:', formData.value);

      // Use Pinia store for authentication
      const success = authStore.login({
        username: formData.value.username,
        password: formData.value.password,
      });

      if (!success) {
        console.log('Login failed:', authStore.authError);
      }
    } else {
      console.log('Form has errors:', errors.value);
    }
  };
</script>
<style lang="scss" scoped>
  .signin-page {
    min-height: 100vh;
    background: var(--color-background);
  }

  .signin-form-container {
    margin: 2rem 0rem 2rem;
    padding: 2rem 0.5rem;
    min-height: calc(100vh - 80px); // Adjust for NavMenu height
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow-y: auto;
  }

  .signin-form-card {
    background: var(--color-heading);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.02) 100%
      );
      pointer-events: none;
    }

    .container-fluid {
      padding: 0;
      position: relative;
      z-index: 1;
    }
  }

  .form-title {
    color: #6be1c7;
    font-weight: 600;
    font-size: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: 2rem;
  }

  .form-label {
    color: var(--vt-c-white);
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .signin-input {
    background: var(--color-text);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    color: var(--vt-c-white-soft);
    font-size: 1rem;
    transition: all 0.3s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    &:focus {
      background: var(--color-text);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.1);
      color: var(--vt-c-white-soft);
      outline: none;
    }

    &:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }

    &.error-input {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.15) !important;

      &:focus {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
      }
    }

    &.valid-input {
      border-color: #6be1c7 !important;
      box-shadow: 0 0 0 0.25rem rgba(104, 211, 145, 0.15) !important;

      &:focus {
        border-color: #6be1c7 !important;
        box-shadow: 0 0 0 0.25rem rgba(104, 211, 145, 0.25) !important;
      }
    }
  }

  .signin-btn {
    background: #6be1c7;
    color: var(--color-heading);
    border: none;
    border-radius: 12px;
    padding: 0.875rem 2rem;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    margin-top: 1rem;

    &:hover:not(:disabled) {
      background: #a7d7ce;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      color: var(--color-heading);
    }

    &:focus {
      box-shadow: 0 0 0 0.25rem rgba(190, 227, 219, 0.5);
      color: var(--color-heading);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled,
    &.disabled-btn {
      background: rgba(121, 246, 219, 0.4) !important;
      color: rgba(195, 203, 232, 0.6) !important;
      cursor: not-allowed !important;
      transform: none !important;
      box-shadow: none !important;
    }
  }

  .signup-link {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    margin: 0;

    .link-text {
      color: rgba(255, 255, 255, 0.95);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        color: white;
        text-decoration: underline;
      }
    }
  }

  // Responsive adjustments
  @media (max-width: 768px) {
    .signin-form-container {
      padding: 1rem 0.5rem;
      min-height: 85vh;
    }

    .signin-form-card {
      padding: 2rem 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .signin-form-card {
      padding: 1.5rem 1rem;
      margin: 0 0.5rem;
    }

    .form-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 320px) {
    .signin-form-container {
      padding: 0.5rem;
    }

    .signin-form-card {
      padding: 1.25rem 0.75rem;
    }
  }
</style>
