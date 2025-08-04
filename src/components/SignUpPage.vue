<template>
  <div class="signup-page">
    <NavMenu />
    <div class="signup-form-container">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <div class="signup-form-card">
              <div class="row">
                <div class="col-12">
                  <h2 class="form-title text-center mb-4">Sign Up</h2>
                </div>
              </div>

              <form @submit.prevent="handleSubmit">
                <!-- Username Field -->
                <div class="row mb-3">
                  <div class="col-12">
                    <label for="username" class="form-label">Username</label>
                    <input
                      type="text"
                      class="form-control signup-input"
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

                <!-- Email Field -->
                <div class="row mb-3">
                  <div class="col-12">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control signup-input"
                      :class="{
                        'error-input': hasError('email'),
                        'valid-input': isFieldValid('email'),
                      }"
                      id="email"
                      v-model="formData.email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <!-- Password Field -->
                <div class="row mb-3">
                  <div class="col-12">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control signup-input"
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

                <!-- Confirm Password Field -->
                <div class="row mb-4">
                  <div class="col-12">
                    <label for="confirmPassword" class="form-label"
                      >Confirm Password</label
                    >
                    <input
                      type="password"
                      class="form-control signup-input"
                      :class="{ 'error-input': hasError('confirmPassword') }"
                      id="confirmPassword"
                      v-model="formData.confirmPassword"
                      placeholder="Confirm your password"
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
                        class="btn create-account-btn"
                        :disabled="!isFormValid"
                        :class="{ 'disabled-btn': !isFormValid }"
                      >
                        Create Account
                      </button>
                    </div>
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
    email: '',
    password: '',
    confirmPassword: '',
  });

  const errors = ref([]);

  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Username validation (letters and numbers only)
  const usernameRegex = /^[a-zA-Z0-9]+$/;

  // Validation functions
  const validateUsername = () => {
    const username = formData.value.username.trim();
    if (!username) {
      return 'Username is required';
    }
    if (!usernameRegex.test(username)) {
      return 'Username can only contain letters and numbers';
    }
    return null;
  };

  const validateEmail = () => {
    const email = formData.value.email.trim();
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
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

  const validateConfirmPassword = () => {
    const confirmPassword = formData.value.confirmPassword;
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== formData.value.password) {
      return 'Passwords do not match';
    }
    return null;
  };

  // Update errors array
  const updateErrors = () => {
    errors.value = [];

    const usernameError = validateUsername();
    const emailError = validateEmail();
    const passwordError = validatePassword();
    const confirmPasswordError = validateConfirmPassword();

    if (usernameError)
      errors.value.push({ field: 'username', message: usernameError });
    if (emailError) errors.value.push({ field: 'email', message: emailError });
    if (passwordError)
      errors.value.push({ field: 'password', message: passwordError });
    if (confirmPasswordError)
      errors.value.push({
        field: 'confirmPassword',
        message: confirmPasswordError,
      });
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
      formData.value.email &&
      formData.value.password &&
      formData.value.confirmPassword
    );
  });

  // Watch form data changes and update errors
  watch(formData, updateErrors, { deep: true });

  const handleSubmit = () => {
    updateErrors();
    if (isFormValid.value) {
      console.log('Form submitted:', formData.value);

      // Use Pinia store for registration
      const success = authStore.register({
        username: formData.value.username,
        email: formData.value.email,
        password: formData.value.password,
      });

      if (!success) {
        console.log('Registration failed:', authStore.authError);
      }
    } else {
      console.log('Form has errors:', errors.value);
    }
  };
</script>
<style lang="scss" scoped>
  .signup-page {
    min-height: 100vh;
    background: var(--color-background);
  }

  .signup-form-container {
    margin: 2rem 0rem 2rem;
    padding: 2rem 0.5rem;
    min-height: calc(100vh - 80px); // Adjust for NavMenu height
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow-y: auto;
  }

  .signup-form-card {
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

  .signup-input {
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
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.1);
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

  .create-account-btn {
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

  // Responsive adjustments
  @media (max-width: 768px) {
    .signup-form-container {
      padding: 1rem 0.5rem;
      min-height: 85vh;
    }

    .signup-form-card {
      padding: 2rem 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .signup-form-card {
      padding: 1.5rem 1rem;
      margin: 0 0.5rem;
    }

    .form-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 320px) {
    .signup-form-container {
      padding: 0.5rem;
    }

    .signup-form-card {
      padding: 1.25rem 0.75rem;
    }
  }
</style>
