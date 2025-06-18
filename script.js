// script.js

// Seleção dos elementos
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const sectionsWrapper = document.querySelector('.sections-wrapper');
const btnTopo = document.getElementById('btnTopo');
const typingElement = document.querySelector('.home-header');
const formContato = document.getElementById('form-contato');
const alertaSucesso = document.getElementById('alertaSucesso');
const btnDemo = document.getElementById("btnDemo");
const modalDemo = document.getElementById("modalDemo");
const closeModal = document.getElementById("closeModal");

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
    sections[index].scrollIntoView({ behavior: 'smooth' });
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

    const formData = new FormData(formContato);

    alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');

    formContato.reset();

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

// Modal do vídeo Jesusinho
if (btnDemo && modalDemo && closeModal) {
  btnDemo.addEventListener("click", () => {
    modalDemo.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    modalDemo.style.display = "none";
    const iframe = modalDemo.querySelector("iframe");
    if (iframe) {
      // Para o vídeo do YouTube (reload da src)
      iframe.src = iframe.src;
    }
  });

  modalDemo.addEventListener("click", (e) => {
    if (e.target === modalDemo) {
      modalDemo.style.display = "none";
      const iframe = modalDemo.querySelector("iframe");
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  });
}

// Reativa seção ao redimensionar (responsividade)
window.addEventListener('resize', () => {
  const currentIndex = parseInt(localStorage.getItem('activeSectionIndex'), 10) || 0;
  activateSection(currentIndex);
});
