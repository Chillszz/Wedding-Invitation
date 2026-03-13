/* ============================================
   WEDDING INVITATION - SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Elements ----------
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const openInviteBtn = document.getElementById('openInviteBtn');
  const mainContent = document.getElementById('mainContent');
  const floatingNav = document.getElementById('floatingNav');
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');

  // ---------- Envelope Opening ----------
  openInviteBtn.addEventListener('click', () => {
    envelopeOverlay.classList.add('opening');

    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      mainContent.classList.remove('hidden');
      floatingNav.classList.remove('hidden');
      document.body.style.overflow = 'auto';

      // Trigger hero animations after content is visible
      setTimeout(() => {
        triggerHeroAnimations();
        initScrollAnimations();
        createPetals();
      }, 200);
    }, 600);
  });

  // Prevent scrolling when envelope is shown
  document.body.style.overflow = 'hidden';

  // ---------- Navigation ----------
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navList.classList.toggle('open');
  });

  // Close nav on link click
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navList.classList.remove('open');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!floatingNav.contains(e.target)) {
      navToggle.classList.remove('active');
      navList.classList.remove('open');
    }
  });

  // Highlight active nav item on scroll
  const sections = document.querySelectorAll('.section');
  const navLinks = navList.querySelectorAll('a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(updateActiveNav, 100));

  // ---------- Hero Animations ----------
  function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-section .fade-up');
    heroElements.forEach(el => {
      el.classList.add('visible');
    });
  }

  // ---------- Scroll Reveal Animations ----------
  function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ---------- Countdown Timer ----------
  const weddingDate = new Date('2026-05-27T13:00:00');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('countDays').textContent = '0';
      document.getElementById('countHours').textContent = '0';
      document.getElementById('countMinutes').textContent = '0';
      document.getElementById('countSeconds').textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countDays').textContent = days;
    document.getElementById('countHours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('countMinutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('countSeconds').textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- Gallery Lightbox ----------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxImg = document.getElementById('lightboxImg');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      if (src && lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = item.querySelector('img')?.alt || 'Gallery photo';
      }
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  // ---------- Floating Petals ----------
  function createPetals() {
    const petalsContainer = document.querySelector('.floating-petals');
    if (!petalsContainer) return;

    const petalCount = window.innerWidth < 768 ? 8 : 15;
    const colors = ['#E8D5A3', '#D4A574', '#C9B99A', '#F5E6D3', '#dbc9a8'];

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');

      const size = Math.random() * 10 + 8;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 8 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];

      petal.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: 0;
      `;

      petalsContainer.appendChild(petal);
    }
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ---------- Parallax-like Subtle Effect on Hero ----------
  const heroSection = document.querySelector('.hero-section');

  window.addEventListener('scroll', throttle(() => {
    if (!heroSection) return;
    const scrolled = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrolled < heroHeight) {
      const opacity = 1 - (scrolled / heroHeight) * 0.5;
      const translateY = scrolled * 0.3;
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translateY(${translateY}px)`;
        heroContent.style.opacity = opacity;
      }
    }
  }, 16));

  // ---------- Utility: Throttle ----------
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
});
