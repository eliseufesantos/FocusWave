/**
 * Modal System
 * Sistema completo de gerenciamento de modais
 */

(function() {
  'use strict';

  const ModalSystem = {
    activeModal: null,
    previousFocus: null,

    /**
     * Inicializa o sistema de modais
     */
    init() {
      this.setupEventListeners();
      console.log('🎭 Modal System initialized');
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
      // Event delegation para botões que abrem modais
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
          e.preventDefault();
          const modalId = trigger.getAttribute('data-modal');
          this.open(modalId);
        }

        // Botões de fechar modal
        const closeBtn = e.target.closest('[data-close]');
        if (closeBtn) {
          e.preventDefault();
          this.close();
        }
      });

      // ESC para fechar modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.close();
        }
      });
    },

    /**
     * Abre um modal
     * @param {string} modalId - ID do modal (sem o prefixo 'modal-')
     */
    open(modalId) {
      const modal = document.getElementById(`modal-${modalId}`);

      if (!modal) {
        console.error(`Modal with id "modal-${modalId}" not found`);
        return;
      }

      // Guarda o elemento que estava focado
      this.previousFocus = document.activeElement;

      // Define o modal ativo
      this.activeModal = modal;

      // Adiciona classe modal--active ao modal
      modal.classList.add('modal--active');

      // Adiciona classe body--modal-open ao body (previne scroll)
      document.body.classList.add('body--modal-open');

      // Aplica blur ao main container
      const mainContainer = document.getElementById('main-container');
      if (mainContainer) {
        mainContainer.style.filter = 'blur(4px)';
      }

      // Focus trap - foca no primeiro elemento focável do modal
      this.focusFirstElement(modal);

      console.log(`✅ Modal opened: ${modalId}`);
    },

    /**
     * Fecha o modal ativo
     */
    close() {
      if (!this.activeModal) return;

      const modal = this.activeModal;

      // Remove classe modal--active (trigger animação reversa)
      modal.classList.remove('modal--active');

      // Remove classe do body
      document.body.classList.remove('body--modal-open');

      // Remove blur do main container
      const mainContainer = document.getElementById('main-container');
      if (mainContainer) {
        mainContainer.style.filter = '';
      }

      // Retorna foco ao elemento anterior
      if (this.previousFocus) {
        this.previousFocus.focus();
      }

      // Limpa referências
      this.activeModal = null;
      this.previousFocus = null;

      console.log('❌ Modal closed');
    },

    /**
     * Foca no primeiro elemento focável do modal
     * @param {HTMLElement} modal - Elemento modal
     */
    focusFirstElement(modal) {
      const focusableElements = this.getFocusableElements(modal);
      if (focusableElements.length > 0) {
        // Timeout pequeno para garantir que o modal está visível
        setTimeout(() => {
          focusableElements[0].focus();
        }, 100);
      }
    },

    /**
     * Obtém todos os elementos focáveis dentro do modal
     * @param {HTMLElement} container - Container do modal
     * @returns {HTMLElement[]} Array de elementos focáveis
     */
    getFocusableElements(container) {
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ];

      return Array.from(
        container.querySelectorAll(selectors.join(','))
      );
    }
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ModalSystem.init();
    });
  } else {
    ModalSystem.init();
  }

  // Expõe API pública
  window.ModalSystem = {
    open: (modalId) => ModalSystem.open(modalId),
    close: () => ModalSystem.close()
  };

})();