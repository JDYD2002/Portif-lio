// script.js

// Seleção dos elementos
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const sectionsWrapper = document.querySelector('.sections-wrapper');
const btnTopo = document.getElementById('btnTopo');
const typingElement = document.querySelector('.home-header');
const formContato = document.getElementById('form-contato');
const alertaSucesso = document.getElementById('alertaSucesso');

function isMobile() {
  return window.innerWidth <= 768;
}

// Efeito de digitação inicial (header home)
let text = typingElement ? typingElement.textContent : '';
if (typingElement) typingElement.textContent = '';

let i = 0;
function type() {
  if (i < text.length) {
    typingElement.textContent += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}
if (typingElement) type();

// Efeito digitação "Olá, sou o Felipe" na classe .typing (se existir)
const typing = document.querySelector('.typing');
const fullText = "Olá, sou o Felipe ";
let typingIndex = 0;
let typingTimeout;

function typingEffect() {
  if (!typing) return;
  if (typingIndex < fullText.length) {
    typing.textContent += fullText.charAt(typingIndex);
    typingIndex++;
    typingTimeout = setTimeout(typingEffect, 100);
  }
}

function restartTypingAnimation() {
  if (!typing) return;
  clearTimeout(typingTimeout);
  typing.textContent = "";
  typingIndex = 0;
  typingEffect();
}

// Função para ativar seção (mobile/desktop)
function activateSection(index) {
  navLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));

  navLinks[index].classList.add('active');
  sections[index].classList.add('active');

  if (!isMobile()) {
    // Desktop: slide horizontal
    sectionsWrapper.style.transform = `translateX(-${index * 100}vw)`;
    sections[index].scrollTop = 0;
  } else {
    // Mobile: scroll vertical
    sectionsWrapper.style.transform = '';
    const targetSection = sections[index];
    if (targetSection) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const sectionTop = targetSection.offsetTop - navHeight - 10;
      
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
    }
  }

  localStorage.setItem('activeSectionIndex', index);

  if (index === 0) {
    restartTypingAnimation();
  }
}

// Eventos de clique no menu
navLinks.forEach((link, index) => {
  link.addEventListener('click', e => {
    e.preventDefault();
    activateSection(index);
    // PostHog: Track navigation click (após navegação funcionar)
    if (typeof trackNavigationClick === 'function') {
      trackNavigationClick(link.textContent.toLowerCase());
    }
  });
});

// Eventos de clique nos botões CTA do hero
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const targetNav = btn.getAttribute('data-nav');
    const targetIndex = Array.from(navLinks).findIndex(link => 
      link.textContent.toLowerCase() === targetNav
    );
    if (targetIndex !== -1) {
      activateSection(targetIndex);
    }
    // PostHog: Track contact/navigation CTA click (após navegação funcionar)
    if (typeof trackContactClick === 'function') {
      trackContactClick('cta_' + btn.getAttribute('data-nav'));
    }
  });
});

// Botão voltar ao topo
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    btnTopo.classList.add('show');
  } else {
    btnTopo.classList.remove('show');
  }
  scrollReveal();
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Formulário contato (envio via formsubmit.co ajax)
if (formContato) {
  formContato.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // PostHog: Track form submission
    if (typeof trackContactClick === 'function') {
      trackContactClick('form_submit');
    }

    const formData = new FormData(formContato);
    const submitButton = formContato.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'Enviar';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }

    try {
      const resposta = await fetch("https://formsubmit.co/ajax/felipebraga233@gmail.com", {
        method: "POST",
        body: formData,
      });
      
      if (resposta.ok) {
        formContato.reset();
        alertaSucesso.style.display = 'block';
        setTimeout(() => alertaSucesso.style.display = 'none', 3000);
      } else {
        alert("Erro ao enviar a mensagem. Tente novamente mais tarde.");
      }
    } catch (error) {
      alert("Erro ao enviar a mensagem. Verifique sua conexão.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

// Animação dos elementos .reveal da seção
function animateReveal(section) {
  const revealElements = section.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    el.classList.remove('active');
    void el.offsetWidth; // força reflow
    el.classList.add('active');
  });
}

// IntersectionObserver para animação ao entrar na tela
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateReveal(entry.target);
    } else {
      const revealElements = entry.target.querySelectorAll('.reveal');
      revealElements.forEach(el => el.classList.remove('active'));
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  sectionObserver.observe(section);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  // Restaura a seção ativa do localStorage
  const savedIndex = localStorage.getItem('activeSectionIndex');
  const index = savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  activateSection(index);
  scrollReveal();
  
  // PostHog: Setup tracking for project links and social links
  setupProjectTracking();
  setupSocialTracking();
});

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Função para animar elementos já visíveis no scroll e no load
function scrollReveal() {
  sections.forEach(section => {
    if (window.scrollY + window.innerHeight > section.offsetTop + section.offsetHeight * 0.1) {
      animateReveal(section);
    }
  });
}

// Função reutilizável para configurar modais de vídeo
function setupVideoModal(btnId, modalId, closeBtnId) {
  const btn = document.getElementById(btnId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  if (!btn || !modal || !closeBtn) return;

  const openModal = () => {
    const iframe = modal.querySelector("iframe");
    if (iframe && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
    modal.style.display = "flex";
    modal.style.animation = "fadeIn 0.3s ease";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Bloqueia scroll do body
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.style.animation = "fadeOut 0.2s ease";
    setTimeout(() => {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      const iframe = modal.querySelector("iframe");
      if (iframe) {
        iframe.src = "";
      }
      document.body.style.overflow = ""; // Restaura scroll do body
      btn.focus();
    }, 200);
  };

  btn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  // Fechar ao clicar fora do modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar com tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });
}

// Configurar todos os modais de vídeo
setupVideoModal("btnDemo", "modalDemo", "closeModal");
setupVideoModal("btnDemoHoper", "modalDemoHoper", "closeModalHoper");
setupVideoModal("btnDemoEmergencia", "modalDemoEmergencia", "closeModalEmergencia");
setupVideoModal("btnDemoNeeko", "modalDemoNeeko", "closeModalNeeko");

// Reativa seção ao redimensionar (responsividade)
window.addEventListener('resize', () => {
  const currentIndex = parseInt(localStorage.getItem('activeSectionIndex'), 10) || 0;
  activateSection(currentIndex);
});

// ============================================
// POSTHOG TRACKING FUNCTIONS
// ============================================

/**
 * Setup tracking for all project links
 * Tracks clicks on GitHub links, frontend/backend links, and demo buttons
 */
function setupProjectTracking() {
  if (typeof trackProjectClick !== 'function' || typeof trackGitHubClick !== 'function') {
    return;
  }

  // Track all github-link class elements (project links)
  const projectLinks = document.querySelectorAll('.github-link');
  projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const projectCard = link.closest('.projeto-card');
      const projectName = projectCard ? projectCard.querySelector('h3').textContent : 'unknown';
      
      // Determine link type based on the link text or URL
      let linkType = 'unknown';
      const linkText = link.textContent.trim();
      const href = link.getAttribute('href');
      
      if (linkText.includes('Código') || href.includes('github.com')) {
        linkType = 'codigo';
        trackGitHubClick(projectName);
      } else if (linkText.includes('Frontend') || linkText.includes('🌐')) {
        linkType = 'frontend';
      } else if (linkText.includes('Backend') || linkText.includes('🧠')) {
        linkType = 'backend';
      } else if (linkText.includes('Site') || linkText.includes('Ver Site')) {
        linkType = 'site';
      }
      
      trackProjectClick(projectName, linkType);
    });
  });

  // Track demo buttons
  const demoButtons = document.querySelectorAll('.botao-chamativo');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectCard = btn.closest('.projeto-card');
      const projectName = projectCard ? projectCard.querySelector('h3').textContent : 'unknown';
      trackProjectClick(projectName, 'demo');
    });
  });
}

/**
 * Setup tracking for social media links
 * Tracks clicks on LinkedIn, Instagram, WhatsApp, and Facebook
 */
function setupSocialTracking() {
  if (typeof trackLinkedInClick !== 'function' || typeof trackContactClick !== 'function') {
    return;
  }

  const socialLinks = document.querySelectorAll('.social-links a');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const ariaLabel = link.getAttribute('aria-label');
      
      if (ariaLabel === 'LinkedIn') {
        trackLinkedInClick();
      } else {
        // Track other social links as contact clicks
        trackContactClick('social_' + ariaLabel.toLowerCase());
      }
    });
  });

  // Track CV download link
  const cvLink = document.querySelector('a[download]');
  if (cvLink) {
    cvLink.addEventListener('click', (e) => {
      if (typeof trackCVDownload === 'function') {
        trackCVDownload();
      }
    });
  }
}
