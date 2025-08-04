<template>
  <div>
    <!-- Toggle Button -->
    <button
      class="sidebar-toggle"
      @click="toggleSidebar"
      :class="{ 'menu-open': isMenuOpen }"
      aria-label="Toggle Sidebar"
    >
      <span class="toggle-line"></span>
      <span class="toggle-line"></span>
      <span class="toggle-line"></span>
    </button>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-open': isMenuOpen }">
      <div class="sidebar-header">
        <h3 class="sidebar-title">Menu</h3>
      </div>

      <nav class="sidebar-nav">
        <a
          href="/design"
          class="sidebar-link"
          :class="{ active: isActive('/design') }"
        >
          <span class="link-text">Design</span>
        </a>
        <a
          href="/template"
          class="sidebar-link"
          :class="{ active: isActive('/template') }"
        >
          <span class="link-text">Template</span>
        </a>

        <!-- Logout Button -->
        <button @click="handleLogout" class="sidebar-link sidebar-logout-btn">
          <span class="link-text">Logout</span>
        </button>
      </nav>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="isMenuOpen" class="sidebar-overlay" @click="closeSidebar"></div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '../../stores/auth';

  const authStore = useAuthStore();

  // Sidebar toggle state
  const isMenuOpen = ref(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  // Close sidebar
  const closeSidebar = () => {
    isMenuOpen.value = false;
  };

  // Handle logout
  const handleLogout = () => {
    authStore.logout();
  };

  // Check if current page is active
  const isActive = path => {
    return (
      window.location.pathname === path ||
      window.location.pathname.endsWith(path)
    );
  };
</script>

<style lang="scss" scoped>
  // Toggle Button
  .sidebar-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: var(--color-text);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(107, 225, 199, 0.1);
      border-color: #6be1c7;
      transform: scale(1.05);
    }

    &.menu-open {
      left: 265px; // Sidebar width + 15px margin

      .toggle-line {
        &:nth-child(1) {
          transform: rotate(45deg) translate(3px, 4px);
        }
        &:nth-child(2) {
          opacity: 0;
        }
        &:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -6px);
        }
      }
    }

    .toggle-line {
      width: 20px;
      height: 2px;
      background: #6be1c7;
      margin: 2px 0;
      transition: all 0.3s ease;
      border-radius: 2px;
    }
  }

  // Sidebar
  .sidebar {
    position: fixed;
    top: 0;
    left: -250px; // Hidden by default
    width: 250px;
    height: 100vh;
    background: var(--color-text);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;

    &.sidebar-open {
      left: 0; // Slide in
    }
  }

  .sidebar-header {
    padding: 2rem 1.5rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .sidebar-title {
      color: #6be1c7;
      font-weight: 600;
      font-size: 1.5rem;
      margin: 0;
      text-align: center;
    }
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    color: var(--vt-c-white);
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #6be1c7;
      text-decoration: none;
      border-left-color: #6be1c7;
    }

    &.active {
      background: rgba(107, 225, 199, 0.1);
      color: #6be1c7;
      border-left-color: #6be1c7;
    }

    &.sidebar-logout-btn {
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(220, 53, 69, 0.1);
        color: #dc3545;
        border-left-color: #dc3545;
      }
    }

    .link-text {
      margin-left: 0;
    }
  }

  // Overlay for mobile
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  // Responsive design for smaller screens
  @media (max-width: 768px) {
    .sidebar-toggle {
      &.menu-open {
        left: 215px; // Adjusted for smaller sidebar width
      }
    }

    .sidebar {
      width: 200px;
      left: -200px;
    }

    .sidebar-header {
      padding: 1.5rem 1rem 1rem;

      .sidebar-title {
        font-size: 1.25rem;
      }
    }

    .sidebar-link {
      padding: 0.875rem 1rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 576px) {
    .sidebar-toggle {
      top: 0.75rem;
      left: 0.75rem;
      width: 45px;
      height: 45px;
      padding: 0.5rem;

      &.menu-open {
        left: 195px; // Adjusted for smaller sidebar width
      }

      .toggle-line {
        width: 18px;
        height: 2px;
      }
    }

    .sidebar {
      width: 180px;
      left: -180px;
    }

    .sidebar-header {
      padding: 1rem 0.75rem 0.75rem;

      .sidebar-title {
        font-size: 1.1rem;
      }
    }

    .sidebar-link {
      padding: 0.75rem 0.75rem;
      font-size: 0.85rem;
    }
  }
</style>
