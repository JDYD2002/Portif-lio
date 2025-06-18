// Seu código atual...

// Seleção dos elementos
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const sectionsWrapper = document.querySelector('.sections-wrapper');
function isMobile() {
  return window.innerWidth <= 768;
}

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

function activateSection(index) {
  // Remove active de todos
  navLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));

  // Adiciona active no atual
  navLinks[index].classList.add('active');
  sections[index].classList.add('active');

  if (!isMobile()) {
    // Desktop: slide horizontal
    sectionsWrapper.style.transform = `translateX(-${index * 100}vw)`;
    sections[index].scrollTop = 0;
  } else {
    // Mobile: scroll vertical normal
    sectionsWrapper.style.transform = '';
    sections[index].scrollIntoView({ behavior: 'smooth' });
  }

  localStorage.setItem('activeSectionIndex', index);

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

// Botão voltar ao topo
const btnTopo = document.getElementById('btnTopo');

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
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
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

// Evento load - reseta tudo para o estado inicial
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

  closeModal.addEventListener("click", () => {
    modalDemo.style.display = "none";
    const video = modalDemo.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });

  modalDemo.addEventListener("click", (e) => {
    if (e.target === modalDemo) {
      modalDemo.style.display = "none";
      const video = modalDemo.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  });
}
window.addEventListener('resize', () => {
  const currentIndex = parseInt(localStorage.getItem('activeSectionIndex'), 10) || 0;
  activateSection(currentIndex);
});
document.getElementById('form-contato').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const resposta = await fetch("https://formsubmit.co/ajax/felipebraga233@gmail.com", {
    method: "POST",
    body: formData
  });
  if (resposta.ok) {
    form.reset();
    const alerta = document.getElementById('alertaSucesso');
    alerta.classList.add('mostrar');
    setTimeout(() => alerta.classList.remove('mostrar'), 3000); // Some após 3s
  }
});
