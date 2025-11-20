/**
 * Animations System
 * Gerencia animações de entrada usando Intersection Observer
 */

(function() {
  'use strict';

  const AnimationsSystem = {
    // Configurações do Intersection Observer
    observerOptions: {
      root: null, // viewport
      rootMargin: '0px 0px -50px 0px', // Trigger 50px antes do bottom
      threshold: 0.1 // 10% do elemento visível
    },

    // Observer instance
    observer: null,

    /**
     * Inicializa o sistema de animações
     */
    init() {
      // Verificar se Intersection Observer é suportado
      if (!('IntersectionObserver' in window)) {
        console.warn('⚠️ Intersection Observer não suportado. Animações desabilitadas.');
        this.fallbackToImmediate();
        return;
      }

      // Criar observer
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.observerOptions
      );

      // Observar todos os elementos com classes de animação
      this.observeElements();

      console.log('✨ Animations System initialized');
    },

    /**
     * Observa elementos que devem ser animados
     */
    observeElements() {
      const animationClasses = [
        '.fade-in-up',
        '.fade-in',
        '.scale-in',
        '.slide-in-left',
        '.slide-in-right'
      ];

      const selector = animationClasses.join(', ');
      const elements = document.querySelectorAll(selector);

      elements.forEach(el => {
        // Apenas observar se não estiver já animado
        if (!el.classList.contains('animate-in')) {
          this.observer.observe(el);
        }
      });
    },

    /**
     * Manipula interseções detectadas
     * @param {IntersectionObserverEntry[]} entries - Entradas do observer
     */
    handleIntersection(entries) {
      entries.forEach(entry => {
        // Elemento entrou na viewport
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    },

    /**
     * Anima um elemento
     * @param {HTMLElement} element - Elemento a ser animado
     */
    animateElement(element) {
      // Adicionar classe de animação
      element.classList.add('animate-in');

      // Parar de observar este elemento
      this.observer.unobserve(element);
    },

    /**
     * Fallback para navegadores sem suporte
     * Adiciona imediatamente a classe animate-in
     */
    fallbackToImmediate() {
      const animationClasses = [
        '.fade-in-up',
        '.fade-in',
        '.scale-in',
        '.slide-in-left',
        '.slide-in-right'
      ];

      const selector = animationClasses.join(', ');
      const elements = document.querySelectorAll(selector);

      elements.forEach(el => {
        el.classList.add('animate-in');
      });
    },

    /**
     * Adiciona animação a novos elementos dinamicamente
     * @param {HTMLElement} element - Elemento para observar
     */
    observeNewElement(element) {
      if (!this.observer) return;

      // Verificar se tem classe de animação
      const hasAnimationClass = [
        'fade-in-up',
        'fade-in',
        'scale-in',
        'slide-in-left',
        'slide-in-right'
      ].some(className => element.classList.contains(className));

      if (hasAnimationClass && !element.classList.contains('animate-in')) {
        this.observer.observe(element);
      }
    },

    /**
     * Reseta animações (útil para testes)
     */
    reset() {
      const selector = '.animate-in';
      const elements = document.querySelectorAll(selector);

      elements.forEach(el => {
        el.classList.remove('animate-in');
        if (this.observer) {
          this.observer.observe(el);
        }
      });
    },

    /**
     * Destrói o observer (cleanup)
     */
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AnimationsSystem.init();
    });
  } else {
    AnimationsSystem.init();
  }

  // Expõe API pública
  window.AnimationsSystem = AnimationsSystem;

})();