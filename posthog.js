/**
 * PostHog Analytics Integration
 * 
 * Este arquivo centraliza toda a configuração e funções de tracking do PostHog.
 * PostHog é uma plataforma de analytics open-source que permite rastrear eventos,
 * page views, e comportamento do usuário.
 * 
 * Documentação: https://posthog.com/docs
 */

// ============================================
// CONFIGURAÇÃO DO POSTHOG
// ============================================

// Substitua 'SUA_PROJECT_API_KEY' pela sua Project API Key do PostHog
// Você pode encontrar essa chave em: https://app.posthog.com/project/settings
const POSTHOG_PROJECT_API_KEY = 'phc_mjGmxDmPb4rdnjQRRYB9LVkjCB3akVBGmis3jCfFvyKC';

// API Host do PostHog (usar o padrão ou seu próprio host se self-hosted)
const POSTHOG_API_HOST = 'https://app.posthog.com';

// Inicializa o PostHog com o SDK web oficial via CDN
(function() {
  // Carrega o script do PostHog
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://cdn.jsdelivr.net/npm/posthog-js/dist/posthog.min.js';
  script.onload = function() {
    // Inicializa o PostHog após o script carregar
    if (typeof posthog !== 'undefined') {
      posthog.init(POSTHOG_PROJECT_API_KEY, {
        api_host: POSTHOG_API_HOST,
        // Habilita captura automática de page views
        capture_pageview: true,
        // Habilita captura automática de page leave
        capture_pageleave: true,
        // Captura o tempo na página automaticamente
        autocapture: false, // Desabilitamos autocapture para ter controle manual
        // Persistência do usuário (usa cookies/localStorage para identificar visitantes recorrentes)
        persistence: 'localStorage',
        // Nome da aplicação
        app_name: 'Portfólio Felipe Braga',
        // Debug mode (desative em produção)
        loaded: function(ph) {
          console.log('PostHog inicializado com sucesso!');
        }
      });
    }
  };
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
})();

// ============================================
// TRACKING AUTOMÁTICO
// ============================================

/**
 * Page View Tracking
 * O PostHog já captura page views automaticamente com capture_pageview: true
 * Mas podemos adicionar propriedades personalizadas se necessário
 */
function trackPageView() {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('$pageview', {
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer
    });
  }
}

/**
 * Page Leave Tracking
 * Captura quando o usuário sai da página
 * O PostHog já faz isso automaticamente com capture_pageleave: true
 * Mas podemos adicionar tracking manual para mais controle
 */
let pageLoadTime = Date.now();

window.addEventListener('beforeunload', () => {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000); // em segundos
    
    posthog.capture('page_leave', {
      time_on_page_seconds: timeOnPage,
      page: window.location.pathname,
      scroll_depth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) || 0
    });
  }
});

// ============================================
// FUNÇÕES DE TRACKING PERSONALIZADAS
// ============================================

/**
 * Track GitHub Click
 * Registra quando o usuário clica em um link do GitHub
 * @param {string} projectName - Nome do projeto (opcional)
 */
function trackGitHubClick(projectName = 'unknown') {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('github_click', {
      project_name: projectName,
      url: window.location.pathname
    });
    console.log('PostHog: GitHub click tracked -', projectName);
  }
}

/**
 * Track LinkedIn Click
 * Registra quando o usuário clica no link do LinkedIn
 */
function trackLinkedInClick() {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('linkedin_click', {
      url: window.location.pathname
    });
    console.log('PostHog: LinkedIn click tracked');
  }
}

/**
 * Track CV Download
 * Registra quando o usuário baixa o currículo
 */
function trackCVDownload() {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('cv_download', {
      url: window.location.pathname
    });
    console.log('PostHog: CV download tracked');
  }
}

/**
 * Track Project Click
 * Registra quando o usuário clica em um projeto específico
 * @param {string} projectName - Nome do projeto
 * @param {string} linkType - Tipo de link (frontend, backend, código, site)
 */
function trackProjectClick(projectName, linkType = 'unknown') {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('project_click', {
      project_name: projectName,
      link_type: linkType,
      url: window.location.pathname
    });
    console.log('PostHog: Project click tracked -', projectName, '-', linkType);
  }
}

/**
 * Track Contact Button Click
 * Registra quando o usuário clica no botão de contato
 * @param {string} buttonType - Tipo de botão (CTA, form submit, social)
 */
function trackContactClick(buttonType = 'unknown') {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('contact_click', {
      button_type: buttonType,
      url: window.location.pathname
    });
    console.log('PostHog: Contact click tracked -', buttonType);
  }
}

/**
 * Track Navigation Click
 * Registra quando o usuário clica no menu de navegação
 * @param {string} section - Seção de destino (home, sobre, projetos, contato)
 */
function trackNavigationClick(section) {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('navigation_click', {
      section: section,
      url: window.location.pathname
    });
    console.log('PostHog: Navigation click tracked -', section);
  }
}

/**
 * Track Scroll to Section
 * Registra quando o usuário rola até uma seção específica
 * @param {string} section - Nome da seção (sobre, projetos, contato)
 */
function trackScrollToSection(section) {
  if (typeof posthog !== 'undefined' && posthog.capture) {
    posthog.capture('scroll_to_section', {
      section: section,
      url: window.location.pathname
    });
    console.log('PostHog: Scroll to section tracked -', section);
  }
}

// ============================================
// TRACKING DE SCROLL AUTOMÁTICO
// ============================================

/**
 * Configura o tracking de scroll para as seções principais
 * Usa IntersectionObserver para detectar quando a seção entra na viewport
 */
function setupScrollTracking() {
  const sections = {
    'sobre': document.getElementById('sobre'),
    'projetos': document.getElementById('projetos'),
    'contato': document.getElementById('contato')
  };

  // Cria um observer para cada seção
  Object.entries(sections).forEach(([sectionName, element]) => {
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Usa sessionStorage para evitar tracking duplicado na mesma sessão
          const hasTracked = sessionStorage.getItem(`scroll_${sectionName}`);
          
          if (!hasTracked) {
            trackScrollToSection(sectionName);
            sessionStorage.setItem(`scroll_${sectionName}`, 'true');
          }
        }
      });
    }, {
      threshold: 0.3 // Trigger quando 30% da seção estiver visível
    });

    observer.observe(element);
  });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

// Inicializa o tracking de scroll quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupScrollTracking);
} else {
  setupScrollTracking();
}

// Limpa sessionStorage ao recarregar a página para permitir tracking de scroll novamente
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('scroll_sobre');
  sessionStorage.removeItem('scroll_projetos');
  sessionStorage.removeItem('scroll_contato');
});

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Identifica o usuário manualmente (opcional)
 * Use isso se tiver informações do usuário (email, nome, etc.)
 * @param {string} distinctId - Identificador único do usuário
 * @param {object} properties - Propriedades do usuário
 */
function identifyUser(distinctId, properties = {}) {
  posthog.identify(distinctId, properties);
  console.log('PostHog: User identified -', distinctId);
}

/**
 * Reset do usuário (para testes)
 * Remove o identificador do usuário atual
 */
function resetUser() {
  posthog.reset();
  console.log('PostHog: User reset');
}

// Exporta as funções para uso global (se necessário)
window.PostHogAnalytics = {
  trackGitHubClick,
  trackLinkedInClick,
  trackCVDownload,
  trackProjectClick,
  trackContactClick,
  trackNavigationClick,
  trackScrollToSection,
  identifyUser,
  resetUser
};
