<template>
  <div class="index-page">
    <NavMenu />

    <!-- Index Page Content -->
    <div class="container-fluid">
      <div class="row justify-content-center align-items-center">
        <div class="col-12 col-md-10 col-lg-8 col-xl-6">
          <div class="text-center">
            <h1 class="display-4 fw-bold mb-2">Portphelia</h1>
            <p id="heading-desc" class="lead mb-4">
              Create portfolios that cater to a company's need with just a few
              clicks
            </p>
            <div class="row justify-content-center">
              <div class="col-12 col-sm-8 col-lg-6">
                <div class="d-grid gap-2">
                  <button @click="handleSignInClick" class="btn signup-btn">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import NavMenu from './menu/NavMenu.vue';
  import { onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';

  const authStore = useAuthStore();

  // Initialize auth state on page load
  onMounted(() => {
    authStore.initializeAuth();
  });

  const handleSignInClick = () => {
    // If user is already authenticated, redirect to design page
    if (authStore.checkAuthAndRedirect()) {
      return; // User was redirected
    }

    // Otherwise, go to sign in page
    window.location.href = '/signin';
  };
</script>

<style lang="scss" scoped>
  .index-page {
    padding: 0;

    .container-fluid {
      padding: 2rem 1rem;
    }

    h1 {
      color: var(--color-heading);
      line-height: 1.2;
    }

    #heading-desc {
      color: var(--color-heading);
      line-height: 1.6;
      opacity: 0.9;
      font-size: clamp(1rem, 3vw, 1.25rem);
      max-width: 90%;
      margin: 0 auto 2rem auto;
    }

    .signup-btn {
      padding: 0.6rem 2rem !important;
      background: rgba(252, 252, 252, 0.2) !important;
      color: var(--color-text) !important;
      text-decoration: none;
      border-radius: 20px !important;
      border: 2px solid var(--vt-c-white-soft) !important;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.3s ease;
      display: inline-block;

      &:hover {
        background: rgba(255, 255, 255, 0.5) !important;
        transform: translateY(-2px);
        color: var(--color-text) !important;
        border-color: var(--vt-c-white-soft) !important;
      }

      &:focus {
        box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
        color: var(--color-text) !important;
      }
    }
  }

  // Responsive adjustments
  @media (max-width: 768px) {
    .index-page {
      .container-fluid {
        padding: clamp(1rem, 4vw, 2rem) clamp(0.5rem, 2vw, 1rem);
      }
    }
  }

  @media (max-width: 576px) {
    .index-page {
      .signup-btn {
        width: 100%;
        max-width: 20rem;
        margin: 0 auto;
      }
    }
  }

  @media (max-width: 320px) {
    .index-page {
      .container-fluid {
        padding: 1rem 0.5rem;
      }

      #heading-desc {
        font-size: 0.9rem;
        max-width: 95%;
      }
    }
  }
</style>
