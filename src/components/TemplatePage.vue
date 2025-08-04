<template>
  <div class="template-page">
    <UserMenu />
    <div class="template-content">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12">
            <div class="template-header">
              <h1 class="page-title">Card Templates</h1>
              <p class="welcome-text">
                Choose a template, customize it, and save to your design page
              </p>
            </div>
          </div>
        </div>

        <!-- Template Cards Section -->
        <div class="template-cards-section">
          <!-- Template Cards -->
          <div class="row mt-4">
            <div
              v-for="template in paginatedCards"
              :key="template.id"
              class="col-12 col-md-6 col-lg-4 mb-4"
            >
              <div
                class="template-card"
                :style="{
                  backgroundColor: template.colors?.background || '#2e3440',
                  borderColor: template.colors?.title || '#6be1c7',
                }"
              >
                <div class="card-header">
                  <h3
                    class="card-title"
                    :style="{ color: template.colors?.title || '#6be1c7' }"
                  >
                    {{ template.title }}
                  </h3>
                  <button
                    class="btn btn-sm edit-btn"
                    @click="startEditing(template)"
                  >
                    Customize
                  </button>
                </div>
                <p
                  class="card-content"
                  :style="{ color: template.colors?.content || '#ffffff' }"
                >
                  {{ template.content }}
                </p>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="row mt-4">
            <div class="col-12">
              <div class="pagination-container">
                <nav aria-label="Template pagination">
                  <ul class="pagination justify-content-center">
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === 1 }"
                    >
                      <button
                        class="page-link"
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        aria-label="Previous page"
                      >
                        <span>&lt;</span>
                      </button>
                    </li>

                    <li
                      v-for="page in visiblePages"
                      :key="page"
                      class="page-item"
                      :class="{ active: page === currentPage }"
                    >
                      <button
                        class="page-link"
                        @click="goToPage(page)"
                        :aria-label="`Go to page ${page}`"
                        :aria-current="
                          page === currentPage ? 'page' : undefined
                        "
                      >
                        {{ page }}
                      </button>
                    </li>

                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === totalPages }"
                    >
                      <button
                        class="page-link"
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        aria-label="Next page"
                      >
                        <span>&gt;</span>
                      </button>
                    </li>
                  </ul>
                </nav>

                <div class="pagination-info">
                  <p class="text-white">
                    Showing {{ startIndex + 1 }}-{{
                      Math.min(endIndex, templateCards.length)
                    }}
                    of {{ templateCards.length }} templates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Card Creation -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="create-card-section">
              <h2 class="section-title">Create Custom Card</h2>
              <div class="row justify-content-center">
                <div class="col-12 col-lg-8">
                  <button
                    class="btn btn-primary create-custom-btn"
                    @click="createCustomCard"
                  >
                    <i class="fa-solid fa-plus"></i> Create New Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingTemplate ? 'Customize Template' : 'Create Custom Card' }}
          </h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="cardTitle" class="form-label">Card Title</label>
            <input
              type="text"
              id="cardTitle"
              v-model="editingCard.title"
              class="form-control"
              placeholder="Enter card title..."
              maxlength="50"
            />
            <small class="char-count">{{ editingCard.title.length }}/50</small>
          </div>

          <div class="form-group">
            <label for="cardContent" class="form-label">Card Content</label>
            <textarea
              id="cardContent"
              v-model="editingCard.content"
              class="form-control"
              rows="6"
              placeholder="Enter card content..."
              maxlength="300"
            ></textarea>
            <small class="char-count"
              >{{ editingCard.content.length }}/300</small
            >
          </div>

          <!-- Color Customization Section -->
          <div class="color-customization-section">
            <h4 class="color-section-title">Color Customization</h4>

            <div class="color-controls">
              <div class="color-group">
                <label for="bgColor" class="color-label"
                  >Background Color</label
                >
                <div class="color-input-group">
                  <input
                    type="color"
                    id="bgColor"
                    v-model="editingCard.colors.background"
                    class="color-picker"
                  />
                  <input
                    type="text"
                    v-model="editingCard.colors.background"
                    class="color-text-input"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div class="color-group">
                <label for="titleColor" class="color-label">Title Color</label>
                <div class="color-input-group">
                  <input
                    type="color"
                    id="titleColor"
                    v-model="editingCard.colors.title"
                    class="color-picker"
                  />
                  <input
                    type="text"
                    v-model="editingCard.colors.title"
                    class="color-text-input"
                    placeholder="#6be1c7"
                  />
                </div>
              </div>

              <div class="color-group">
                <label for="contentColor" class="color-label"
                  >Content Color</label
                >
                <div class="color-input-group">
                  <input
                    type="color"
                    id="contentColor"
                    v-model="editingCard.colors.content"
                    class="color-picker"
                  />
                  <input
                    type="text"
                    v-model="editingCard.colors.content"
                    class="color-text-input"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            <!-- Color Presets -->
            <div class="color-presets">
              <label class="preset-label">Quick Presets:</label>
              <div class="preset-buttons">
                <button
                  type="button"
                  class="preset-btn"
                  @click="applyColorPreset('default')"
                >
                  Default
                </button>
                <button
                  type="button"
                  class="preset-btn"
                  @click="applyColorPreset('dark')"
                >
                  Dark
                </button>
                <button
                  type="button"
                  class="preset-btn"
                  @click="applyColorPreset('light')"
                >
                  Light
                </button>
                <button
                  type="button"
                  class="preset-btn"
                  @click="applyColorPreset('ocean')"
                >
                  Ocean
                </button>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h4 class="preview-title">Preview</h4>
            <div
              class="card-preview"
              :style="{
                backgroundColor: editingCard.colors.background,
                borderColor: editingCard.colors.title + '33',
              }"
            >
              <h5
                class="preview-card-title"
                :style="{ color: editingCard.colors.title }"
              >
                {{ editingCard.title || 'Card Title' }}
              </h5>
              <p
                class="preview-card-content"
                :style="{ color: editingCard.colors.content }"
              >
                {{ editingCard.content || 'Card content will appear here...' }}
              </p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button
            class="btn btn-primary"
            @click="saveCard"
            :disabled="
              !editingCard.title.trim() ||
              !editingCard.content.trim() ||
              isSaving
            "
          >
            {{ isSaving ? 'Saving...' : 'Save to Design Page' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="toast-notification success">
      <i class="fa-solid fa-check-circle"></i>
      Card saved to your design page!
    </div>

    <!-- Error Toast -->
    <div v-if="cardStore.cardError" class="toast-notification error">
      <i class="fa-solid fa-exclamation-circle"></i>
      {{ cardStore.cardError }}
    </div>
  </div>
</template>

<script setup>
  import UserMenu from './menu/UserMenu.vue';
  import { ref, onMounted, computed } from 'vue';
  import { useCardStore } from '../stores/card';
  import { useAuthStore } from '../stores/auth';

  const cardStore = useCardStore();
  const authStore = useAuthStore();

  // State
  const showEditModal = ref(false);
  const editingTemplate = ref(null);
  const editingCard = ref({
    title: '',
    content: '',
    colors: {
      background: '#555b6e',
      title: '#6be1c7',
      content: '#ffffff',
    },
  });
  const isSaving = ref(false);
  const showSuccessToast = ref(false);

  // Template cards data
  const templateCards = ref([]);

  // Pagination state
  const currentPage = ref(1);
  const cardsPerPage = 3;

  // Computed properties for pagination
  const totalPages = computed(() => {
    return Math.ceil(templateCards.value.length / cardsPerPage);
  });

  const startIndex = computed(() => {
    return (currentPage.value - 1) * cardsPerPage;
  });

  const endIndex = computed(() => {
    return startIndex.value + cardsPerPage;
  });

  const paginatedCards = computed(() => {
    return templateCards.value.slice(startIndex.value, endIndex.value);
  });

  const visiblePages = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;

    // Simple pagination - show all pages for small number of pages
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // For more pages, show current page and 2 pages on each side
      let start = Math.max(1, current - 2);
      let end = Math.min(total, current + 2);

      // Adjust if we're near the beginning or end
      if (current <= 3) {
        end = 5;
      } else if (current >= total - 2) {
        start = total - 4;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  });

  // Pagination functions
  const goToPage = page => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      // Scroll to top of cards section
      document.querySelector('.template-header')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  onMounted(() => {
    // Require authentication
    authStore.requireAuth();

    // Load template cards
    templateCards.value = cardStore.getTemplateCards();
  });

  // Modal functions
  const startEditing = template => {
    editingTemplate.value = template;
    editingCard.value = {
      title: template.title,
      content: template.content,
      colors: {
        background: template.colors?.background || '#555b6e',
        title: template.colors?.title || '#6be1c7',
        content: template.colors?.content || '#ffffff',
      },
    };
    showEditModal.value = true;
  };

  const createCustomCard = () => {
    editingTemplate.value = null;
    editingCard.value = {
      title: '',
      content: '',
      colors: {
        background: '#555b6e',
        title: '#6be1c7',
        content: '#ffffff',
      },
    };
    showEditModal.value = true;
  };

  const closeModal = () => {
    showEditModal.value = false;
    editingTemplate.value = null;
    editingCard.value = {
      title: '',
      content: '',
      colors: {
        background: '#555b6e',
        title: '#6be1c7',
        content: '#ffffff',
      },
    };
    cardStore.clearError();
  };

  // Color preset functions
  const applyColorPreset = presetName => {
    const presets = {
      default: {
        background: '#555b6e',
        title: '#6be1c7',
        content: '#ffffff',
      },
      dark: {
        background: '#1a1a1a',
        title: '#ff6b6b',
        content: '#e0e0e0',
      },
      light: {
        background: '#f7fafc',
        title: '#555b6e',
        content: '#4a5568',
      },
      ocean: {
        background: '#0f3460',
        title: '#16d9e3',
        content: '#adb5bd',
      },
    };

    if (presets[presetName]) {
      editingCard.value.colors = { ...presets[presetName] };
    }
  };

  const saveCard = async () => {
    try {
      isSaving.value = true;

      const cardData = {
        title: editingCard.value.title.trim(),
        content: editingCard.value.content.trim(),
        colors: {
          background: editingCard.value.colors.background,
          title: editingCard.value.colors.title,
          content: editingCard.value.colors.content,
        },
      };

      const savedCard = cardStore.createCard(cardData);

      if (savedCard) {
        // Show success notification
        showSuccessToast.value = true;
        setTimeout(() => {
          showSuccessToast.value = false;
        }, 3000);

        // Close modal
        closeModal();
      }
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      isSaving.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  .template-page {
    min-height: 100vh;
    background: var(--color-heading);
  }

  .template-content {
    padding: 2rem 1rem;
    min-height: calc(100vh - 80px);
  }

  .template-header {
    text-align: center;
    margin-bottom: 2rem;

    .page-title {
      color: #6be1c7;
      font-weight: 600;
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 0.5rem;
    }

    .welcome-text {
      color: var(--vt-c-white);
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }
  }

  .template-cards-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 2rem;
    margin-top: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
  }

  .template-card {
    border-radius: 15px;
    padding: 2rem 1.5rem;
    height: 100%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;

      .card-title {
        font-weight: 600;
        font-size: 1.25rem;
        margin: 0;
        flex: 1;
      }

      .edit-btn {
        background: #6be1c7;
        color: var(--color-heading);
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        margin-left: 1rem;

        &:hover {
          background: #a7d7ce;
          transform: translateY(-1px);
        }
      }
    }

    .card-content {
      opacity: 0.9;
      margin: 0;
      line-height: 1.5;
    }
  }

  .create-card-section {
    text-align: center;
    padding: 2rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .section-title {
      color: #6be1c7;
      font-weight: 600;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .create-custom-btn {
      background: linear-gradient(135deg, #6be1c7 0%, #4db8a3 100%);
      color: var(--color-heading);
      border: none;
      border-radius: 12px;
      padding: 1rem 2rem;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(107, 225, 199, 0.3);
      }

      i {
        margin-right: 0.5rem;
      }
    }
  }

  // Pagination styles
  .pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .pagination {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .page-item {
      margin: 0;

      .page-link {
        background: var(--color-text);
        border: 2px solid rgba(255, 255, 255, 0.1);
        color: var(--vt-c-white);
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;

        &:hover:not(:disabled) {
          background: rgba(107, 225, 199, 0.1);
          border-color: #6be1c7;
          color: #6be1c7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(107, 225, 199, 0.3);
        }

        &:focus {
          box-shadow: 0 0 0 0.25rem rgba(107, 225, 199, 0.25);
          border-color: #6be1c7;
          outline: none;
          color: #6be1c7;
          background: rgba(107, 225, 199, 0.05);
        }

        &:hover:focus:not(:disabled) {
          box-shadow:
            0 0 0 0.25rem rgba(107, 225, 199, 0.25),
            0 4px 12px rgba(107, 225, 199, 0.3);
          border-color: #6be1c7;
          color: #6be1c7;
          transform: translateY(-2px);
          background: rgba(107, 225, 199, 0.15);
        }
      }

      // Circular number buttons
      &:not(:first-child):not(:last-child) .page-link {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        padding: 0;
        font-size: 0.9rem;
        font-weight: 600;
      }

      // Arrow buttons (first and last)
      &:first-child .page-link,
      &:last-child .page-link {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        padding: 0;

        i {
          font-size: 0.9rem;
          font-weight: 600;
        }
      }

      &.active .page-link {
        background: linear-gradient(135deg, #6be1c7 0%, #4db8a3 100%);
        color: var(--color-heading);
        border-color: #6be1c7;
        box-shadow: 0 4px 15px rgba(107, 225, 199, 0.4);
        transform: scale(1.1);

        &:hover {
          background: linear-gradient(135deg, #a7d7ce 0%, #6be1c7 100%);
          border-color: #a7d7ce;
          transform: scale(1.1) translateY(-1px);
        }
      }

      &.disabled .page-link {
        opacity: 0.4;
        cursor: not-allowed;
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.05);

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.05);
          color: var(--vt-c-white);
          transform: none;
          box-shadow: none;
        }
      }
    }
  }

  .pagination-info {
    text-align: center;

    .text-muted {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      margin: 0;
      font-weight: 500;
    }
  }

  // Modal styles
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
  }

  .modal-content {
    background: var(--color-text);
    border-radius: 20px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .modal-title {
      color: #6be1c7;
      font-weight: 600;
      font-size: 1.5rem;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--vt-c-white);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .modal-body {
    padding: 1.5rem 2rem;

    .form-group {
      margin-bottom: 1.5rem;

      .form-label {
        color: var(--vt-c-white);
        font-weight: 500;
        font-size: 0.95rem;
        margin-bottom: 0.5rem;
        display: block;
      }

      .form-control {
        width: 100%;
        background: var(--color-heading);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 0.875rem 1rem;
        color: var(--vt-c-white);
        font-size: 1rem;
        transition: all 0.3s ease;
        resize: vertical;

        &:focus {
          outline: none;
          border-color: #6be1c7;
          box-shadow: 0 0 0 0.25rem rgba(107, 225, 199, 0.15);
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .char-count {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
        text-align: right;
      }
    }

    // Color customization section
    .color-customization-section {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .color-section-title {
        color: #6be1c7;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
      }

      .color-controls {
        display: grid;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .color-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .color-label {
            color: var(--vt-c-white);
            font-weight: 500;
            font-size: 0.9rem;
          }

          .color-input-group {
            display: flex;
            gap: 0.75rem;
            align-items: center;

            .color-picker {
              width: 50px;
              height: 40px;
              border: 2px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              background: transparent;
              cursor: pointer;
              transition: all 0.3s ease;

              &:hover {
                border-color: #6be1c7;
                transform: scale(1.05);
              }

              &:focus {
                outline: none;
                border-color: #6be1c7;
                box-shadow: 0 0 0 0.25rem rgba(107, 225, 199, 0.15);
              }
            }

            .color-text-input {
              flex: 1;
              background: var(--color-heading);
              border: 2px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 0.5rem 0.75rem;
              color: var(--vt-c-white);
              font-size: 0.9rem;
              font-family: 'Courier New', monospace;
              transition: all 0.3s ease;

              &:focus {
                outline: none;
                border-color: #6be1c7;
                box-shadow: 0 0 0 0.25rem rgba(107, 225, 199, 0.15);
              }

              &::placeholder {
                color: rgba(255, 255, 255, 0.4);
              }
            }
          }
        }
      }

      .color-presets {
        .preset-label {
          color: var(--vt-c-white);
          font-weight: 500;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.75rem;
        }

        .preset-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;

          .preset-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 0.5rem 1rem;
            color: var(--vt-c-white);
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(107, 225, 199, 0.1);
              border-color: #6be1c7;
              color: #6be1c7;
              transform: translateY(-1px);
            }

            &:focus {
              outline: none;
              box-shadow: 0 0 0 0.25rem rgba(107, 225, 199, 0.15);
            }
          }
        }
      }
    }

    .preview-section {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .preview-title {
        color: #6be1c7;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }

      .card-preview {
        border-radius: 12px;
        padding: 1.5rem;
        border: 2px solid;
        transition: all 0.3s ease;

        .preview-card-title {
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
        }

        .preview-card-content {
          opacity: 0.9;
          margin: 0;
          line-height: 1.5;
        }
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem 2rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &.btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--vt-c-white);

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }

      &.btn-primary {
        background: #6be1c7;
        color: var(--color-heading);

        &:hover:not(:disabled) {
          background: #a7d7ce;
          transform: translateY(-1px);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }

  // Toast notifications
  .toast-notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 500;
    z-index: 3000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideInRight 0.3s ease;

    &.success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    &.error {
      background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    }

    i {
      font-size: 1.1rem;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  // Responsive adjustments
  @media (max-width: 768px) {
    .template-content {
      padding: 1.5rem 1rem;
    }

    .template-cards-section {
      padding: 1.5rem;
      margin-top: 0.5rem;
      border-radius: 15px;
    }

    .template-card {
      padding: 1.5rem 1rem;

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;

        .edit-btn {
          margin-left: 0;
          align-self: stretch;
          text-align: center;
        }
      }
    }

    .pagination-container {
      margin-top: 1.5rem;
    }

    .pagination {
      gap: 0.4rem;

      .page-item {
        // Circular number buttons on mobile
        &:not(:first-child):not(:last-child) .page-link {
          width: 36px;
          height: 36px;
          font-size: 0.85rem;
        }

        // Arrow buttons on mobile
        &:first-child .page-link,
        &:last-child .page-link {
          width: 40px;
          height: 40px;
          border-radius: 10px;

          i {
            font-size: 0.85rem;
          }
        }
      }
    }

    .pagination-info .text-muted {
      font-size: 0.8rem;
    }

    .modal-content {
      margin: 1rem;
      max-width: calc(100vw - 2rem);
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    .toast-notification {
      top: 1rem;
      right: 1rem;
      left: 1rem;
      max-width: calc(100vw - 2rem);
    }
  }

  @media (max-width: 576px) {
    .template-content {
      padding: 1rem 0.5rem;
    }

    .template-cards-section {
      padding: 1rem;
      margin-top: 0.5rem;
      border-radius: 12px;
    }

    .template-header {
      margin-bottom: 1.5rem;
    }

    .pagination {
      gap: 0.3rem;

      .page-item {
        // Circular number buttons on small mobile
        &:not(:first-child):not(:last-child) .page-link {
          width: 32px;
          height: 32px;
          font-size: 0.8rem;
        }

        // Arrow buttons on small mobile
        &:first-child .page-link,
        &:last-child .page-link {
          width: 36px;
          height: 36px;
          border-radius: 8px;

          i {
            font-size: 0.8rem;
          }
        }
      }
    }

    .pagination-info {
      .text-muted {
        font-size: 0.75rem;
      }
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .modal-footer {
      flex-direction: column;

      .btn {
        width: 100%;
      }
    }
  }
</style>
