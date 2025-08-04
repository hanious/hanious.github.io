<template>
  <div class="nav-menu">
    <!-- Hamburger Menu Button -->
    <button class="menu-button" @click="toggleMenu" aria-label="Toggle Menu">
      <span class="menu-line"></span>
      <span class="menu-line"></span>
      <span class="menu-line"></span>
    </button>

    <!-- Menu Overlay -->
    <div
      v-if="isMenuOpen"
      class="nav-menu-overlay"
      :class="{ 'fade-out': isClosing }"
      @click="closeMenu"
    >
      <div class="col-xs-10 col-sm-8 col-md-6 col-lg-5 col-xl-4">
        <div
          class="nav-menu-content"
          :class="{ 'slide-out': isClosing }"
          @click.stop
        >
          <div class="container">
            <div class="row">
              <div class="col-12 text-end">
                <button class="close-button" @click="closeMenu">&times;</button>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <a href="/" class="menu-link d-block">Home</a>
                <a href="/signup" class="menu-link d-block">Sign Up</a>
                <a href="/signin" class="menu-link d-block">Sign In</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const isMenuOpen = ref(false);
  const isClosing = ref(false);

  const toggleMenu = () => {
    if (isMenuOpen.value) {
      closeMenu();
    } else {
      isMenuOpen.value = true;
      isClosing.value = false;
    }
  };

  const closeMenu = () => {
    isClosing.value = true;
    // Wait for animation to complete before hiding the menu
    setTimeout(() => {
      isMenuOpen.value = false;
      isClosing.value = false;
    }, 300); // Match the animation duration
  };
</script>

<style lang="scss" scoped>
  .nav-menu {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
  }

  .menu-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    .menu-line {
      margin-bottom: 0.2rem;
      width: 25px;
      height: 3px;
      background-color: var(--color-text);
      border-radius: 2px;
      transition: all 0.3s ease;
    }
  }

  .nav-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    animation: fadeIn 0.3s ease;
    padding: 1rem;
    box-sizing: border-box;
  }

  .nav-menu-content {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 0.2rem 0.5rem 2rem 0.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow-y: auto;
    text-align: center;
    animation: slideIn 0.3s ease;
    margin: auto;
    width: 20vw;
    max-width: 90vw;

    .row {
      margin: 0;
      padding: 0;
    }

    .col-12 {
      padding: 0;
    }
  }

  .close-button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--color-text);
    transition: color 0.3s ease;
    width: auto;
    height: auto;
    padding-top: 0;
    padding-bottom: 0rem;

    &:hover {
      color: #666;
    }
  }

  .menu-link {
    text-decoration: none;
    color: var(--color-text);
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    font-weight: 500;
    padding: 0.75rem 0.75rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(85, 91, 110, 0.1);
      border-color: rgba(85, 91, 110, 0.2);
      transform: translateY(-2px);
      color: var(--color-text);
      text-decoration: none;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(85, 91, 110, 0.3);
    }
  }

  .nav-menu-overlay.fade-out {
    animation: fadeOut 0.3s ease;
  }

  .nav-menu-content.slide-out {
    animation: slideOut 0.3s ease;
  }

  @media (max-width: 768px) {
    .nav-menu {
      top: 1rem;
      right: 1rem;
    }

    .nav-menu-content {
      margin: 1rem;
      padding: 2rem 1.5rem;
      min-width: auto;
      width: auto;
      max-width: calc(100vw - 2rem);
    }
  }
</style>
