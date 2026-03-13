/* ============================================
   WEDDING INVITATION - SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Scroll to Top on Load ----------
  window.scrollTo(0, 0);
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

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

  // ---------- RSVP Modal ----------
  const rsvpModal = document.getElementById('rsvpModal');
  const openRsvpBtn = document.getElementById('openRsvpBtn');
  const closeRsvpBtn = document.getElementById('closeRsvpBtn');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpAttending = document.getElementById('rsvpAttending');
  const rsvpGuestCount = document.getElementById('rsvpGuestCount');
  const rsvpGuestNames = document.getElementById('rsvpGuestNames');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const rsvpDecline = document.getElementById('rsvpDecline');

  // Conditional fields
  const conditionalFields = {
    event: document.getElementById('rsvpEventField'),
    guestCount: document.getElementById('rsvpGuestCountField'),
    guestNames: document.getElementById('rsvpGuestNamesField'),
    message: document.getElementById('rsvpMessageField'),
  };

  // Check if already submitted
  if (localStorage.getItem('rsvpSubmitted')) {
    openRsvpBtn.textContent = 'RSVP Submitted ✓';
  }

  // Open modal
  openRsvpBtn.addEventListener('click', () => {
    rsvpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  function closeRsvpModal() {
    rsvpModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeRsvpBtn.addEventListener('click', closeRsvpModal);
  rsvpModal.addEventListener('click', (e) => {
    if (e.target === rsvpModal) closeRsvpModal();
  });

  // Show/hide fields based on attending selection
  rsvpAttending.addEventListener('change', () => {
    const isYes = rsvpAttending.value === 'yes';
    conditionalFields.event.style.display = isYes ? '' : 'none';
    conditionalFields.guestCount.style.display = isYes ? '' : 'none';
    conditionalFields.message.style.display = isYes ? '' : 'none';
    // Reset guest names when switching
    if (!isYes) {
      conditionalFields.guestNames.style.display = 'none';
      rsvpGuestNames.innerHTML = '';
      rsvpGuestCount.value = '1';
    }
  });

  // Dynamic guest name inputs
  rsvpGuestCount.addEventListener('change', () => {
    const count = parseInt(rsvpGuestCount.value, 10);
    rsvpGuestNames.innerHTML = '';
    if (count > 1) {
      conditionalFields.guestNames.style.display = '';
      for (let i = 2; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Guest ${i} full name`;
        input.name = `guest${i}`;
        rsvpGuestNames.appendChild(input);
      }
    } else {
      conditionalFields.guestNames.style.display = 'none';
    }
  });

  // Form submit
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('rsvpName');
    const phone = document.getElementById('rsvpPhone');
    let valid = true;

    [name, phone, rsvpAttending].forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) return;

    const isAttending = rsvpAttending.value === 'yes';

    // Gather form data
    const formData = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      attending: rsvpAttending.value,
      event: isAttending ? (document.querySelector('input[name="event"]:checked')?.value || 'both') : '',
      guestCount: isAttending ? rsvpGuestCount.value : '0',
      guestNames: [],
      message: isAttending ? (document.getElementById('rsvpMessage').value.trim()) : '',
      submittedAt: new Date().toISOString(),
    };

    // Collect guest names
    if (isAttending) {
      rsvpGuestNames.querySelectorAll('input').forEach(input => {
        if (input.value.trim()) formData.guestNames.push(input.value.trim());
      });
    }

    // Disable button while "sending"
    const submitBtn = document.getElementById('rsvpSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Save to localStorage
    localStorage.setItem('rsvpSubmitted', JSON.stringify(formData));

    // Simulate send delay then show success
    setTimeout(() => {
      rsvpForm.style.display = 'none';
      if (isAttending) {
        rsvpSuccess.style.display = '';
      } else {
        rsvpDecline.style.display = '';
      }
      openRsvpBtn.textContent = 'RSVP Submitted ✓';
    }, 800);
  });
});
