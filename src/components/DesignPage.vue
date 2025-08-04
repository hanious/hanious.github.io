<template>
  <div class="design-page">
    <UserMenu />
    <div class="design-content">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12">
            <div class="design-header">
              <h1 class="page-title">Welcome, {{ authStore.userName }}!</h1>
              <p class="welcome-text">Your Personal Portfolio Dashboard</p>
            </div>
          </div>
        </div>

        <!-- User's Saved Cards Section -->
        <div class="portfolio-cards-section">
          <div class="row mt-4">
            <div class="col-12">
              <div class="section-header">
                <h2 class="section-title">Your Portfolio Cards</h2>
                <p class="section-description">
                  Cards you've created and customized are displayed here.
                  <a href="/template" class="template-link"
                    >Create more cards</a
                  >
                </p>
              </div>
            </div>
          </div>

          <!-- Cards Grid -->
          <div v-if="cardStore.isLoading" class="row">
            <div class="col-12 text-center">
              <div class="loading-spinner">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <p>Loading your cards...</p>
              </div>
            </div>
          </div>

          <div v-else-if="userCards.length === 0" class="row">
            <div class="col-12">
              <div class="empty-state">
                <div class="empty-icon">
                  <i class="fa-solid fa-clipboard"></i>
                </div>
                <h3 class="empty-title">No Cards Yet</h3>
                <p class="empty-description">
                  Start building your portfolio by creating your first card
                  template.
                </p>
                <a href="/template" class="btn btn-primary empty-cta">
                  <i class="fa-solid fa-plus"></i> Create Your First Card
                </a>
              </div>
            </div>
          </div>

          <div v-else class="row">
            <div
              v-for="card in paginatedCards"
              :key="card.id"
              class="col-12 col-md-6 col-lg-4 mb-4"
            >
              <div
                class="design-card"
                :style="{
                  backgroundColor: card.colors?.background || '#555b6e',
                  borderColor: card.colors?.title || '#6be1c7',
                }"
              >
                <div class="card-header">
                  <h3
                    class="card-title"
                    :style="{ color: card.colors?.title || '#6be1c7' }"
                  >
                    {{ card.title }}
                  </h3>
                  <div class="card-actions">
                    <button
                      class="btn btn-sm edit-btn"
                      @click="editCard(card)"
                      title="Edit Card"
                    >
                      <i class="fa-solid fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm duplicate-btn"
                      @click="duplicateCard(card.id)"
                      title="Duplicate Card"
                    >
                      <i class="fa-solid fa-copy"></i>
                    </button>
                    <button
                      class="btn btn-sm delete-btn"
                      @click="deleteCard(card.id)"
                      title="Delete Card"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
                <p
                  class="card-content"
                  :style="{ color: card.colors?.content || '#ffffff' }"
                >
                  {{ card.content }}
                </p>
                <div class="card-footer">
                  <small class="card-timestamp">
                    Created: {{ formatDate(card.createdAt) }}
                  </small>
                  <small
                    v-if="card.updatedAt !== card.createdAt"
                    class="card-timestamp"
                  >
                    Updated: {{ formatDate(card.updatedAt) }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="row mt-4">
            <div class="col-12">
              <div class="pagination-container">
                <nav aria-label="Card pagination">
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
                      Math.min(endIndex, userCards.length)
                    }}
                    of {{ userCards.length }} cards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Edit Card</h3>
          <button class="close-btn" @click="closeEditModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="editCardTitle" class="form-label">Card Title</label>
            <input
              type="text"
              id="editCardTitle"
              v-model="editingCard.title"
              class="form-control"
              placeholder="Enter card title..."
              maxlength="50"
            />
            <small class="char-count">{{ editingCard.title.length }}/50</small>
          </div>

          <div class="form-group">
            <label for="editCardContent" class="form-label">Card Content</label>
            <textarea
              id="editCardContent"
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
          <div class="form-group">
            <label class="form-label">Color Customization</label>
            <div class="color-controls">
              <!-- Background Color -->
              <div class="color-input-group">
                <label for="editBackgroundColor" class="color-label"
                  >Background</label
                >
                <div class="color-input-wrapper">
                  <input
                    type="color"
                    id="editBackgroundColor"
                    v-model="editingCard.colors.background"
                    class="color-picker"
                  />
                  <input
                    type="text"
                    v-model="editingCard.colors.background"
                    class="color-text-input"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <!-- Title Color -->
              <div class="color-input-group">
                <label for="editTitleColor" class="color-label">Title</label>
                <div class="color-input-wrapper">
                  <input
                    type="color"
                    id="editTitleColor"
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

              <!-- Content Color -->
              <div class="color-input-group">
                <label for="editContentColor" class="color-label"
                  >Content</label
                >
                <div class="color-input-wrapper">
                  <input
                    type="color"
                    id="editContentColor"
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
              <span class="presets-label">Quick Presets:</span>
              <button
                type="button"
                class="preset-btn"
                @click="applyEditColorPreset('default')"
              >
                Default
              </button>
              <button
                type="button"
                class="preset-btn"
                @click="applyEditColorPreset('dark')"
              >
                Dark
              </button>
              <button
                type="button"
                class="preset-btn"
                @click="applyEditColorPreset('light')"
              >
                Light
              </button>
              <button
                type="button"
                class="preset-btn"
                @click="applyEditColorPreset('ocean')"
              >
                Ocean
              </button>
            </div>
          </div>

          <div class="preview-section">
            <h4 class="preview-title">Preview</h4>
            <div
              class="card-preview"
              :style="{
                backgroundColor: editingCard.colors.background,
                borderColor: editingCard.colors.title,
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
          <button class="btn btn-secondary" @click="closeEditModal">
            Cancel
          </button>
          <button
            class="btn btn-primary"
            @click="saveEditedCard"
            :disabled="
              !editingCard.title.trim() ||
              !editingCard.content.trim() ||
              isSaving
            "
          >
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="toast-notification success">
      <i class="fa-solid fa-check-circle"></i>
      {{ successMessage }}
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
  import { onMounted, ref, computed } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useCardStore } from '../stores/card';

  const authStore = useAuthStore();
  const cardStore = useCardStore();

  // State
  const showEditModal = ref(false);
  const editingCard = ref({
    id: null,
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
  const successMessage = ref('');

  // Pagination state
  const currentPage = ref(1);
  const cardsPerPage = 3;

  // Computed
  const userCards = computed(() => cardStore.userCards);

  const totalPages = computed(() => {
    return Math.ceil(userCards.value.length / cardsPerPage);
  });

  const startIndex = computed(() => {
    return (currentPage.value - 1) * cardsPerPage;
  });

  const endIndex = computed(() => {
    return startIndex.value + cardsPerPage;
  });

  const paginatedCards = computed(() => {
    const start = (currentPage.value - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return userCards.value.slice(start, end);
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

  // Methods
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const goToPage = page => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      // Scroll to top of cards section
      document.querySelector('.design-header')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const editCard = card => {
    editingCard.value = {
      id: card.id,
      title: card.title,
      content: card.content,
      colors: {
        background: card.colors?.background || '#555b6e',
        title: card.colors?.title || '#6be1c7',
        content: card.colors?.content || '#ffffff',
      },
    };
    showEditModal.value = true;
  };

  const closeEditModal = () => {
    showEditModal.value = false;
    editingCard.value = {
      id: null,
      title: '',
      content: '',
      colors: {
        background: '#555b6e0',
        title: '#6be1c7',
        content: '#ffffff',
      },
    };
    cardStore.clearError();
  };

  const applyEditColorPreset = preset => {
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
        background: '#f8f9fa',
        title: '#495057',
        content: '#6c757d',
      },
      ocean: {
        background: '#0f3460',
        title: '#16d9e3',
        content: '#adb5bd',
      },
    };

    if (presets[preset]) {
      editingCard.value.colors = { ...presets[preset] };
    }
  };

  const saveEditedCard = async () => {
    try {
      isSaving.value = true;

      const success = cardStore.updateCard(editingCard.value.id, {
        title: editingCard.value.title.trim(),
        content: editingCard.value.content.trim(),
        colors: editingCard.value.colors,
      });

      if (success) {
        successMessage.value = 'Card updated successfully!';
        showSuccessToast.value = true;
        setTimeout(() => {
          showSuccessToast.value = false;
        }, 3000);

        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      isSaving.value = false;
    }
  };

  const duplicateCard = async cardId => {
    try {
      const duplicatedCard = cardStore.duplicateCard(cardId);

      if (duplicatedCard) {
        successMessage.value = 'Card duplicated successfully!';
        showSuccessToast.value = true;
        setTimeout(() => {
          showSuccessToast.value = false;
        }, 3000);
      }
    } catch (error) {
      console.error('Error duplicating card:', error);
    }
  };

  const deleteCard = async cardId => {
    if (
      confirm(
        'Are you sure you want to delete this card? This action cannot be undone.'
      )
    ) {
      try {
        const success = cardStore.deleteCard(cardId);

        if (success) {
          successMessage.value = 'Card deleted successfully!';
          showSuccessToast.value = true;
          setTimeout(() => {
            showSuccessToast.value = false;
          }, 3000);
        }
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  // Lifecycle
  onMounted(() => {
    // Require authentication to access this page
    authStore.requireAuth();

    // Load user's cards
    cardStore.loadUserCards();
  });
</script>

<style lang="scss" scoped>
  .design-page {
    min-height: 100vh;
    background: var(--color-heading);
  }

  .design-content {
    padding: 2rem 1rem;
    min-height: calc(100vh - 80px);
  }

  .design-header {
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

  .section-header {
    margin-bottom: 2rem;

    .section-title {
      color: #6be1c7;
      font-weight: 600;
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .section-description {
      color: var(--vt-c-white);
      opacity: 0.8;
      margin: 0;

      .template-link {
        color: #6be1c7;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .portfolio-cards-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 1rem 2rem 2rem 2rem;
    margin-top: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
  }

  .design-card {
    border-radius: 15px;
    padding: 1.5rem;
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
        word-break: break-word;
      }

      .card-actions {
        display: flex;
        gap: 0.5rem;
        margin-left: 1rem;

        .btn {
          padding: 0.375rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;

          &.edit-btn {
            background: #6be1c7;
            color: var(--color-heading);

            &:hover {
              background: #a7d7ce;
              transform: translateY(-1px);
            }
          }

          &.duplicate-btn {
            background: #17a2b8;
            color: white;

            &:hover {
              background: #138496;
              transform: translateY(-1px);
            }
          }

          &.delete-btn {
            background: #dc3545;
            color: white;

            &:hover {
              background: #c82333;
              transform: translateY(-1px);
            }
          }
        }
      }
    }

    .card-content {
      opacity: 0.9;
      margin: 0 0 1rem 0;
      line-height: 1.5;
      word-break: break-word;
    }

    .card-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 0.75rem;
      margin-top: auto;

      .card-timestamp {
        color: var(--vt-c-white);
        opacity: 0.6;
        font-size: 0.8rem;
        display: block;
        margin-bottom: 0.25rem;
      }
    }
  }

  // Loading state
  .loading-spinner {
    padding: 3rem;
    color: var(--vt-c-white);

    i {
      font-size: 2rem;
      color: #6be1c7;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.1rem;
      margin: 0;
      opacity: 0.8;
    }
  }

  // Empty state
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;

    .empty-icon {
      font-size: 4rem;
      color: #6be1c7;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .empty-title {
      color: var(--vt-c-white);
      font-weight: 600;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .empty-description {
      color: var(--vt-c-white);
      opacity: 0.8;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .empty-cta {
      background: linear-gradient(135deg, #6be1c7 0%, #4db8a3 100%);
      color: var(--color-heading);
      border: none;
      border-radius: 12px;
      padding: 1rem 2rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(107, 225, 199, 0.3);
        text-decoration: none;
        color: var(--color-heading);
      }
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

    // Color Controls
    .color-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .color-input-group {
      .color-label {
        color: var(--vt-c-white);
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        display: block;
      }

      .color-input-wrapper {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        .color-picker {
          width: 50px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;

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
          font-family: monospace;
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

    .color-presets {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .presets-label {
        color: var(--vt-c-white);
        font-size: 0.85rem;
        font-weight: 500;
        margin-right: 0.5rem;
      }

      .preset-btn {
        background: rgba(255, 255, 255, 0.1);
        color: var(--vt-c-white);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #6be1c7;
          color: var(--color-heading);
          border-color: #6be1c7;
          transform: translateY(-1px);
        }
      }
    }

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
        background: var(--color-heading);
        border-radius: 12px;
        padding: 1.5rem;
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;

        .preview-card-title {
          color: #6be1c7;
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
        }

        .preview-card-content {
          color: var(--vt-c-white);
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

      // Arrow buttons
      &:first-child .page-link,
      &:last-child .page-link {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        padding: 0;

        span {
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
      background: linear-gradient(to bottom, #20c997 100%, #28a745 0%);
    }

    &.error {
      background: linear-gradient(to bottom, #fd7e14 100%, #dc3545 0%);
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
    .design-content {
      padding: 1.5rem 1rem;
    }

    .portfolio-cards-section {
      padding: 1.5rem;
      margin-top: 0.5rem;
      border-radius: 15px;
    }

    .design-card {
      padding: 1.25rem;

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;

        .card-actions {
          margin-left: 0;
          align-self: stretch;
          justify-content: flex-end;
        }
      }
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

    .color-controls {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .color-presets {
      justify-content: center;

      .presets-label {
        width: 100%;
        text-align: center;
        margin-bottom: 0.5rem;
      }
    }

    .pagination-container {
      margin-top: 1.5rem;

      .pagination {
        gap: 0.375rem;

        .page-item {
          .page-link {
            &:not(:first-child):not(:last-child) {
              width: 36px;
              height: 36px;
              font-size: 0.85rem;
            }

            &:first-child,
            &:last-child {
              width: 40px;
              height: 40px;
            }
          }
        }
      }
    }

    .toast-notification {
      top: 1rem;
      right: 1rem;
      left: 1rem;
      max-width: calc(100vw - 2rem);
    }

    .stats-section {
      padding: 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .design-content {
      padding: 1rem 0.5rem;
    }

    .portfolio-cards-section {
      padding: 1rem;
      margin-top: 0.5rem;
      border-radius: 12px;
    }

    .design-header {
      margin-bottom: 1.5rem;
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

    .pagination-container {
      margin-top: 1rem;

      .pagination {
        gap: 0.25rem;

        .page-item {
          .page-link {
            &:not(:first-child):not(:last-child) {
              width: 32px;
              height: 32px;
              font-size: 0.8rem;
            }

            &:first-child,
            &:last-child {
              width: 36px;
              height: 36px;
            }
          }
        }
      }

      .pagination-info .text-muted {
        font-size: 0.8rem;
      }
    }

    .empty-state {
      padding: 2rem 1rem;

      .empty-icon {
        font-size: 3rem;
      }

      .empty-title {
        font-size: 1.25rem;
      }
    }
  }
</style>
