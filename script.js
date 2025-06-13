// Seleção dos elementos
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const sectionsWrapper = document.querySelector('.sections-wrapper');

const typingElement = document.querySelector('.home-header'); // ou '.typing'
const text = typingElement ? typingElement.textContent : '';
if (typingElement) typingElement.textContent = '';

let i = 0;

// Função de digitação inicial (para o header, se houver)
function type() {
  if (i < text.length) {
    typingElement.textContent += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

// Inicia a digitação inicial se o elemento existir
if (typingElement) type();

// Texto para efeito de digitação (ex: Home)
const typing = document.querySelector('.typing');
const fullText = "Olá, sou o Felipe ";
let typingIndex = 0;
let typingTimeout;

function typingEffect() {
  if (typingIndex < fullText.length) {
    typing.textContent += fullText.charAt(typingIndex);
    typingIndex++;
    typingTimeout = setTimeout(typingEffect, 100);
  }
}

function restartTypingAnimation() {
  clearTimeout(typingTimeout);
  typing.textContent = "";
  typingIndex = 0;
  typingEffect();
}

// Função para ativar uma seção pelo índice
function activateSection(index) {
  // Remove active de todos
  navLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));

  // Adiciona active no atual
  navLinks[index].classList.add('active');
  sections[index].classList.add('active');

  // Move o wrapper
  sectionsWrapper.style.transform = `translateX(-${index * 100}vw)`;

  // Scroll para topo da janela
  window.scrollTo(0, 0);

  // Salva índice no localStorage para manter após reload
  localStorage.setItem('activeSectionIndex', index);

  // Reinicia digitação se for home
  if (index === 0) {
    restartTypingAnimation();
  }
}

// Evento dos links do menu
navLinks.forEach((link, index) => {
  link.addEventListener('click', e => {
    e.preventDefault();
    activateSection(index);
  });
});

// Formulário (demo)
const formContato = document.getElementById('form-contato');
if (formContato) {
  formContato.addEventListener('submit', e => {
    e.preventDefault();
    alert('Mensagem enviada! (funcionalidade backend não implementada)');
    formContato.reset();
  });
}

// Função para animar os elementos .reveal da seção
function animateReveal(section) {
  const revealElements = section.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    el.classList.remove('active');
    void el.offsetWidth; // força reflow
    el.classList.add('active');
  });
}

// Intersection Observer para animação
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateReveal(entry.target);
    } else {
      // Remove animação ao sair da tela (opcional)
      const revealElements = entry.target.querySelectorAll('.reveal');
      revealElements.forEach(el => el.classList.remove('active'));
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  sectionObserver.observe(section);
});

// Função para animar elementos já visíveis no scroll e no load
function scrollReveal() {
  sections.forEach(section => {
    if (window.scrollY + window.innerHeight > section.offsetTop + section.offsetHeight * 0.1) {
      animateReveal(section);
    }
  });
}

// Evento load - inicializa tudo
window.addEventListener('load', () => {
  // Lê o índice salvo no localStorage ou usa 0 como padrão
  const savedIndex = localStorage.getItem('activeSectionIndex');
  const index = savedIndex !== null ? parseInt(savedIndex, 10) : 0;

  // Ativa a seção salva ou a primeira
  activateSection(index);

  // Anima os elementos que já estão visíveis
  scrollReveal();

  // Scroll para topo da janela
  window.scrollTo(0, 0);
});

// ======================
// Modal do vídeo Jesusinho
// ======================

const btnDemo = document.getElementById("btnDemo");
const modalDemo = document.getElementById("modalDemo");
const closeModal = document.getElementById("closeModal");

if (btnDemo && modalDemo && closeModal) {
  btnDemo.addEventListener("click", () => {
    modalDemo.style.display = "flex";
  });

  function closeVideoModal() {
    modalDemo.style.display = "none";
    const iframe = modalDemo.querySelector("iframe");
    if (iframe) {
      const src = iframe.src;
      iframe.src = "";
      iframe.src = src;
    }
  }

  closeModal.addEventListener("click", closeVideoModal);

  modalDemo.addEventListener("click", (e) => {
    if (e.target === modalDemo) {
      closeVideoModal();
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalDemo.style.display === 'flex') {
      closeVideoModal();
    }
  });
}
