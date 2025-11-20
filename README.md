# 🌊 FocusWave

**FocusWave** é uma aplicação de gerenciamento de tempo com técnica Pomodoro, integrada com IA para sugestões personalizadas de música e insights de produtividade.

![FocusWave Banner](https://via.placeholder.com/800x200/1a1a2e/8b5cf6?text=FocusWave)

## ✨ Funcionalidades

- ⏱️ **Timer Pomodoro Personalizável**: Configure tempos de foco e descanso
- 💬 **Chat com IA**: Receba sugestões de músicas baseadas no seu estado mental
- 🎵 **Player de Música**: Reproduza playlists focadas em produtividade
- 📜 **Histórico**: Acompanhe suas sessões de foco e músicas tocadas
- 🎨 **Design Glassmorphism**: Interface moderna com efeito de vidro fosco
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em todos os dispositivos
- ♿ **Acessível**: Suporte completo a leitores de tela e navegação por teclado

## 🚀 Como Executar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor HTTP local (opcional, mas recomendado)

### Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/focuswave.git
cd focuswave
```

2. **Execute com um servidor HTTP local**:

**Opção 1 - Python 3**:
```bash
cd frontend
python3 -m http.server 8000
```

**Opção 2 - Node.js (http-server)**:
```bash
npm install -g http-server
cd frontend
http-server -p 8000
```

**Opção 3 - PHP**:
```bash
cd frontend
php -S localhost:8000
```

3. **Acesse no navegador**:
```
http://localhost:8000
```

## 📁 Estrutura do Projeto

```
FocusWave/
├── frontend/
│   ├── index.html              # Página principal
│   ├── css/
│   │   ├── variables.css       # Variáveis CSS (tokens de design)
│   │   ├── reset.css           # Reset CSS para consistência
│   │   ├── global.css          # Estilos globais
│   │   ├── glassmorphism.css   # Efeitos de glassmorphism
│   │   ├── components.css      # Componentes reutilizáveis
│   │   ├── modals.css          # Estilos de modais
│   │   └── responsive.css      # Media queries e responsividade
│   └── js/
│       ├── animations.js       # Sistema de animações com Intersection Observer
│       ├── modal.js            # Gerenciamento de modais
│       ├── timer.js            # Lógica do timer Pomodoro
│       ├── player.js           # Player de música
│       ├── chat.js             # Chat com IA (simulado)
│       ├── history.js          # Sistema de histórico com localStorage
│       └── app.js              # Inicialização da aplicação
└── README.md                   # Este arquivo
```

## 🎨 Convenções de Código

### CSS

#### **Design Tokens**
Todas as variáveis CSS estão definidas em [variables.css](frontend/css/variables.css:1):

```css
/* Cores */
--color-bg-primary: #0f0f1e;
--color-accent: #8b5cf6;

/* Espaçamento */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
```

#### **Metodologia BEM**
Utilizamos BEM (Block Element Modifier) para nomenclatura:

```css
/* Block */
.timer-card { }

/* Element */
.timer-card__header { }
.timer-card__time { }

/* Modifier */
.timer-card--active { }
.btn--primary { }
```

#### **Glassmorphism**
Componentes com efeito de vidro utilizam:

```css
.glass-card {
  background: var(--color-glass-bg);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```

### JavaScript

#### **IIFE Pattern**
Todos os módulos utilizam IIFE para encapsulamento:

```javascript
(function() {
  'use strict';

  const MySystem = {
    init() {
      // Inicialização
    }
  };

  window.MySystem = MySystem;
})();
```

#### **Nomenclatura**
- **PascalCase**: Para sistemas/módulos (ex: `TimerSystem`, `PlayerSystem`)
- **camelCase**: Para funções e variáveis (ex: `playMusic`, `currentTime`)
- **UPPER_CASE**: Para constantes (ex: `MAX_HISTORY_ITEMS`)

## 🔧 Como Adicionar Novos Componentes

### 1. HTML
Adicione o markup em [index.html](frontend/index.html:1):

```html
<section id="my-component" class="my-component glass-card fade-in-up">
  <div class="my-component__header">
    <h3 class="my-component__title">Título</h3>
  </div>
  <div class="my-component__content">
    <!-- Conteúdo -->
  </div>
</section>
```

### 2. CSS
Adicione os estilos em [components.css](frontend/css/components.css:1):

```css
/* ========================================
   MY COMPONENT
   ======================================== */

.my-component {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.my-component__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.my-component__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
```

### 3. JavaScript
Crie um novo arquivo `js/my-component.js`:

```javascript
(function() {
  'use strict';

  const MyComponentSystem = {
    init() {
      this.cacheElements();
      this.attachEventListeners();
      console.log('🎯 MyComponent System initialized');
    },

    cacheElements() {
      this.element = document.getElementById('my-component');
    },

    attachEventListeners() {
      // Event listeners
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      MyComponentSystem.init();
    });
  } else {
    MyComponentSystem.init();
  }

  window.MyComponentSystem = MyComponentSystem;
})();
```

### 4. Link no HTML
Adicione o script em [index.html](frontend/index.html:269):

```html
<script src="js/my-component.js"></script>
```

## 🎯 Variáveis CSS Disponíveis

### Cores
```css
--color-bg-primary: #0f0f1e;
--color-bg-secondary: #1a1a2e;
--color-accent: #8b5cf6;
--color-accent-hover: #7c3aed;
--color-text-primary: #f8fafc;
--color-text-secondary: #cbd5e1;
--color-text-tertiary: #64748b;
```

### Espaçamento
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

### Tipografia
```css
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
```

### Raios de Borda
```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-full: 9999px;   /* Circular */
```

## 📱 Breakpoints Responsivos

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

## ♿ Acessibilidade

O projeto implementa:

- **ARIA labels**: Todos os elementos interativos têm labels descritivos
- **ARIA live regions**: Atualizações dinâmicas são anunciadas para leitores de tela
- **Focus-visible**: Indicadores visuais claros para navegação por teclado
- **Skip link**: Atalho para pular o cabeçalho e ir direto ao conteúdo
- **Roles semânticos**: `banner`, `main`, `dialog`, `region`, etc.
- **Reduced motion**: Suporte para `prefers-reduced-motion`

### Navegação por Teclado

- `Tab`: Navegar entre elementos
- `Shift + Tab`: Navegar para trás
- `Enter` / `Space`: Ativar botões
- `Esc`: Fechar modais

## 🧪 Testando

### Teste de Acessibilidade
1. Use o leitor de tela NVDA (Windows) ou VoiceOver (Mac)
2. Navegue apenas com o teclado
3. Teste em modo alto contraste

### Teste de Responsividade
1. Abra as DevTools do navegador
2. Use o modo de visualização responsiva
3. Teste em diferentes tamanhos de tela

### Teste de Performance
1. Abra DevTools → Lighthouse
2. Execute auditoria de Performance e Acessibilidade
3. O objetivo é >90 em ambos

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Variáveis CSS, Flexbox, Grid, Animations
- **JavaScript (ES6+)**: Modules, Classes, Arrow Functions
- **Intersection Observer API**: Para animações ao scroll
- **LocalStorage API**: Persistência de dados
- **Web Audio API**: (futuro) Para reprodução de áudio

## 📝 Roadmap

- [ ] Integração com API de IA real (OpenAI/Anthropic)
- [ ] Sistema de autenticação (Firebase/Auth0)
- [ ] Sincronização em nuvem
- [ ] PWA (Progressive Web App)
- [ ] Integração com Spotify/YouTube Music
- [ ] Estatísticas e gráficos de produtividade
- [ ] Modo escuro/claro
- [ ] Exportar relatórios em PDF
- [ ] Notificações push
- [ ] Integração com calendário

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Adiciona nova funcionalidade
fix: Corrige um bug
docs: Atualiza documentação
style: Formatação, falta de ponto e vírgula, etc
refactor: Refatoração de código
perf: Melhoria de performance
test: Adiciona testes
chore: Atualiza tarefas de build, configs, etc
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com 💜 por [Seu Nome]

---

**FocusWave** - Transformando foco em produtividade 🌊