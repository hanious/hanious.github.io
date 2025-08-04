import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useCardStore = defineStore('card', () => {
  // State
  const cards = ref([]);
  const isLoading = ref(false);
  const cardError = ref('');
  const isLoaded = ref(false); // Track if cards have been loaded

  // Getters (computed)
  const userCards = computed(() => cards.value);
  const cardCount = computed(() => cards.value.length);

  // Helper function to get storage key for current user
  const getUserStorageKey = () => {
    const authStore = useAuthStore();
    return authStore.user?.id ? `portphelia_cards_${authStore.user.id}` : null;
  };

  // Actions
  function loadUserCards(forceReload = false) {
    // Only load if not already loaded or if forced reload
    if (isLoaded.value && !forceReload) {
      return;
    }

    try {
      isLoading.value = true;
      cardError.value = '';

      const storageKey = getUserStorageKey();
      if (!storageKey) {
        cards.value = [];
        isLoaded.value = true;
        return;
      }

      const storedCards = localStorage.getItem(storageKey);
      cards.value = storedCards ? JSON.parse(storedCards) : [];
      isLoaded.value = true;
    } catch (error) {
      cardError.value = 'Failed to load cards';
      console.error('Error loading cards:', error);
      cards.value = [];
      isLoaded.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  function saveCardsToStorage() {
    try {
      const storageKey = getUserStorageKey();
      if (!storageKey) return false;

      localStorage.setItem(storageKey, JSON.stringify(cards.value));
      return true;
    } catch (error) {
      cardError.value = 'Failed to save cards';
      console.error('Error saving cards:', error);
      return false;
    }
  }

  function createCard(cardData) {
    try {
      cardError.value = '';

      // Ensure cards are loaded before creating
      if (!isLoaded.value) {
        loadUserCards();
      }

      if (!cardData.title || !cardData.content) {
        cardError.value = 'Title and content are required';
        return null;
      }

      const newCard = {
        id: Date.now(),
        title: cardData.title.trim(),
        content: cardData.content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Color customization properties
        colors: {
          background: cardData.colors?.background || '#555b6e',
          title: cardData.colors?.title || '#6be1c7',
          content: cardData.colors?.content || '#ffffff',
        },
      };

      cards.value.push(newCard);
      saveCardsToStorage();

      return newCard;
    } catch (error) {
      cardError.value = 'Failed to create card';
      console.error('Error creating card:', error);
      return null;
    }
  }

  function updateCard(cardId, cardData) {
    try {
      cardError.value = '';

      if (!cardData.title || !cardData.content) {
        cardError.value = 'Title and content are required';
        return false;
      }

      const cardIndex = cards.value.findIndex(card => card.id === cardId);
      if (cardIndex === -1) {
        cardError.value = 'Card not found';
        return false;
      }

      cards.value[cardIndex] = {
        ...cards.value[cardIndex],
        title: cardData.title.trim(),
        content: cardData.content.trim(),
        updatedAt: new Date().toISOString(),
        // Update colors if provided
        colors: {
          background:
            cardData.colors?.background ||
            cards.value[cardIndex].colors?.background ||
            '#555b6e',
          title:
            cardData.colors?.title ||
            cards.value[cardIndex].colors?.title ||
            '#6be1c7',
          content:
            cardData.colors?.content ||
            cards.value[cardIndex].colors?.content ||
            '#ffffff',
        },
      };

      saveCardsToStorage();
      return cards.value[cardIndex];
    } catch (error) {
      cardError.value = 'Failed to update card';
      console.error('Error updating card:', error);
      return false;
    }
  }

  function deleteCard(cardId) {
    try {
      cardError.value = '';

      const cardIndex = cards.value.findIndex(card => card.id === cardId);
      if (cardIndex === -1) {
        cardError.value = 'Card not found';
        return false;
      }

      cards.value.splice(cardIndex, 1);
      saveCardsToStorage();
      return true;
    } catch (error) {
      cardError.value = 'Failed to delete card';
      console.error('Error deleting card:', error);
      return false;
    }
  }

  function getCardById(cardId) {
    return cards.value.find(card => card.id === cardId) || null;
  }

  function duplicateCard(cardId) {
    try {
      cardError.value = '';

      const originalCard = getCardById(cardId);
      if (!originalCard) {
        cardError.value = 'Card not found';
        return null;
      }

      const duplicatedCard = {
        ...originalCard,
        id: Date.now(),
        title: `${originalCard.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      cards.value.push(duplicatedCard);
      saveCardsToStorage();

      return duplicatedCard;
    } catch (error) {
      cardError.value = 'Failed to duplicate card';
      console.error('Error duplicating card:', error);
      return null;
    }
  }

  function clearCards() {
    cards.value = [];
    isLoaded.value = false;
    saveCardsToStorage();
  }

  function clearError() {
    cardError.value = '';
  }

  function clearLoadedState() {
    isLoaded.value = false;
  }

  // Template cards for users to start with
  const getTemplateCards = () => [
    {
      id: 'template-1',
      title: 'Welcome Card',
      content: 'Welcome to your portfolio! Edit this card to make it your own.',
      isTemplate: true,
      colors: {
        background: '#555b6e',
        title: '#6be1c7',
        content: '#ffffff',
      },
    },
    {
      id: 'template-2',
      title: 'About Me',
      content:
        'Tell visitors about yourself, your background, and what makes you unique.',
      isTemplate: true,
      colors: {
        background: '#1a1a1a',
        title: '#ff6b6b',
        content: '#e0e0e0',
      },
    },
    {
      id: 'template-3',
      title: 'My Skills',
      content:
        'List your key skills, technologies, and areas of expertise here.',
      isTemplate: true,
      colors: {
        background: '#f8f9fa',
        title: '#495057',
        content: '#6c757d',
      },
    },
    {
      id: 'template-4',
      title: 'Recent Projects',
      content:
        'Showcase your latest work and projects that demonstrate your abilities.',
      isTemplate: true,
      colors: {
        background: '#0f3460',
        title: '#16d9e3',
        content: '#adb5bd',
      },
    },
    {
      id: 'template-5',
      title: 'Contact Info',
      content: 'Share your contact information and how people can reach you.',
      isTemplate: true,
      colors: {
        background: '#555b6e',
        title: '#6be1c7',
        content: '#ffffff',
      },
    },
    {
      id: 'template-6',
      title: 'Experience',
      content:
        'Highlight your work experience, achievements, and career milestones.',
      isTemplate: true,
      colors: {
        background: '#1a1a1a',
        title: '#ff6b6b',
        content: '#e0e0e0',
      },
    },
    {
      id: 'template-7',
      title: 'Education',
      content:
        'Share your educational background, certifications, and learning journey.',
      isTemplate: true,
      colors: {
        background: '#f8f9fa',
        title: '#495057',
        content: '#6c757d',
      },
    },
  ];

  function createFromTemplate(templateCard) {
    return createCard({
      title: templateCard.title,
      content: templateCard.content,
      colors: templateCard.colors || {
        background: '#555b6e',
        title: '#6be1c7',
        content: '#ffffff',
      },
    });
  }

  return {
    // State
    cards,
    isLoading,
    cardError,

    // Getters
    userCards,
    cardCount,

    // Actions
    loadUserCards,
    createCard,
    updateCard,
    deleteCard,
    getCardById,
    duplicateCard,
    clearCards,
    clearError,
    clearLoadedState,
    getTemplateCards,
    createFromTemplate,
  };
});
