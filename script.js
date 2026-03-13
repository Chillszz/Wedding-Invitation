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
  // *** PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ***
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzR1a9EjllsWSYhSatyJJt7HftvW3A4As37Q5oARUkYyLLYrTxhFE_BOjOl85NIbtri/exec';

  const rsvpModal = document.getElementById('rsvpModal');
  const openRsvpBtn = document.getElementById('openRsvpBtn');
  const closeRsvpBtn = document.getElementById('closeRsvpBtn');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpAttending = document.getElementById('rsvpAttending');
  const rsvpGuestCount = document.getElementById('rsvpGuestCount');
  const rsvpGuestNames = document.getElementById('rsvpGuestNames');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const rsvpDecline = document.getElementById('rsvpDecline');
  const rsvpNameInput = document.getElementById('rsvpName');
  const rsvpPhoneInput = document.getElementById('rsvpPhone');
  const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
  const rsvpMessageInput = document.getElementById('rsvpMessage');

  // Conditional fields
  const conditionalFields = {
    event: document.getElementById('rsvpEventField'),
    guestCount: document.getElementById('rsvpGuestCountField'),
    guestNames: document.getElementById('rsvpGuestNamesField'),
    message: document.getElementById('rsvpMessageField'),
  };

  // Helper to get saved RSVP from localStorage
  function getSavedRsvp() {
    try {
      return JSON.parse(localStorage.getItem('rsvpSubmitted'));
    } catch { return null; }
  }

  // Helper to build guest name inputs
  function buildGuestInputs(count, savedNames) {
    rsvpGuestNames.innerHTML = '';
    if (count > 1) {
      conditionalFields.guestNames.style.display = '';
      for (let i = 2; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Guest ${i} full name`;
        input.name = `guest${i}`;
        if (savedNames && savedNames[i - 2]) input.value = savedNames[i - 2];
        rsvpGuestNames.appendChild(input);
      }
    } else {
      conditionalFields.guestNames.style.display = 'none';
    }
  }

  // Reset form to fresh state (used when sheet says they're removed)
  function resetFormToFresh() {
    localStorage.removeItem('rsvpSubmitted');
    openRsvpBtn.textContent = 'Confirm Attendance';

    // Unlock all fields
    rsvpNameInput.value = '';
    rsvpNameInput.readOnly = false;
    rsvpNameInput.classList.remove('rsvp-locked');

    rsvpPhoneInput.value = '';
    rsvpPhoneInput.readOnly = false;
    rsvpPhoneInput.classList.remove('rsvp-locked');

    rsvpAttending.value = '';
    rsvpAttending.disabled = false;
    rsvpAttending.classList.remove('rsvp-locked');

    // Reset event radios
    const eventRadios = document.querySelectorAll('input[name="event"]');
    eventRadios.forEach(radio => { radio.disabled = false; });
    document.querySelector('input[name="event"][value="both"]').checked = true;
    conditionalFields.event.classList.remove('rsvp-locked-field');

    // Hide conditional fields
    conditionalFields.event.style.display = 'none';
    conditionalFields.guestCount.style.display = 'none';
    conditionalFields.guestNames.style.display = 'none';
    conditionalFields.message.style.display = 'none';

    rsvpGuestCount.value = '1';
    rsvpGuestNames.innerHTML = '';
    rsvpMessageInput.value = '';

    // Show form, hide success states
    rsvpForm.style.display = '';
    rsvpSuccess.style.display = 'none';
    rsvpDecline.style.display = 'none';
    rsvpSubmitBtn.disabled = false;
    rsvpSubmitBtn.textContent = 'Send RSVP';
  }

  // Load edit mode from saved data
  function applyEditMode(saved) {
    openRsvpBtn.textContent = 'Update RSVP';

    if (saved.attending === 'no') {
      rsvpForm.style.display = 'none';
      rsvpDecline.style.display = '';
      return;
    }

    // Lock fields
    rsvpNameInput.value = saved.name;
    rsvpNameInput.readOnly = true;
    rsvpNameInput.classList.add('rsvp-locked');

    rsvpPhoneInput.value = saved.phone;
    rsvpPhoneInput.readOnly = true;
    rsvpPhoneInput.classList.add('rsvp-locked');

    rsvpAttending.value = 'yes';
    rsvpAttending.disabled = true;
    rsvpAttending.classList.add('rsvp-locked');

    // Show attending fields
    conditionalFields.event.style.display = '';
    conditionalFields.guestCount.style.display = '';
    conditionalFields.message.style.display = '';

    // Lock event radios
    const eventRadios = document.querySelectorAll('input[name="event"]');
    eventRadios.forEach(radio => {
      radio.disabled = true;
      if (radio.value === saved.event) radio.checked = true;
    });
    conditionalFields.event.classList.add('rsvp-locked-field');

    // Editable fields
    rsvpGuestCount.value = saved.guestCount || '1';
    buildGuestInputs(parseInt(saved.guestCount, 10), saved.guestNames);
    rsvpMessageInput.value = saved.message || '';

    rsvpSubmitBtn.textContent = 'Update Details';
    rsvpSubmitBtn.disabled = false;
    rsvpForm.style.display = '';
    rsvpSuccess.style.display = 'none';
    rsvpDecline.style.display = 'none';
  }

  // Check Google Sheet for existing RSVP (verifies against the sheet, not just localStorage)
  async function checkSheetForRsvp(phone) {
    if (!GOOGLE_SCRIPT_URL || !phone) return null;
    try {
      const url = `${GOOGLE_SCRIPT_URL}?phone=${encodeURIComponent(phone)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.exists && json.data) return json.data;
      return null;
    } catch {
      return null; // If sheet check fails, fall back to localStorage
    }
  }

  // Initialize on page load — use localStorage first, verify with sheet on modal open
  const savedRsvp = getSavedRsvp();
  if (savedRsvp) {
    applyEditMode(savedRsvp);
  }

  // Open modal — verify with Google Sheet each time
  openRsvpBtn.addEventListener('click', async () => {
    rsvpModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // If we have a saved phone, check the sheet to see if they were removed
    const saved = getSavedRsvp();
    if (saved && GOOGLE_SCRIPT_URL) {
      const sheetData = await checkSheetForRsvp(saved.phone);
      if (!sheetData) {
        // They were removed from the sheet — reset to fresh form
        resetFormToFresh();
      } else {
        // Sheet data might have updates (e.g., you edited it) — sync
        const synced = { ...saved, ...sheetData };
        localStorage.setItem('rsvpSubmitted', JSON.stringify(synced));
        applyEditMode(synced);
      }
    }
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

  // Show/hide fields based on attending selection (first-time only)
  rsvpAttending.addEventListener('change', () => {
    const isYes = rsvpAttending.value === 'yes';
    conditionalFields.event.style.display = isYes ? '' : 'none';
    conditionalFields.guestCount.style.display = isYes ? '' : 'none';
    conditionalFields.message.style.display = isYes ? '' : 'none';
    if (!isYes) {
      conditionalFields.guestNames.style.display = 'none';
      rsvpGuestNames.innerHTML = '';
      rsvpGuestCount.value = '1';
    }
  });

  // Dynamic guest name inputs
  rsvpGuestCount.addEventListener('change', () => {
    const count = parseInt(rsvpGuestCount.value, 10);
    buildGuestInputs(count);
  });

  // Form submit — save to Google Sheet + localStorage
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const saved = getSavedRsvp();
    const isUpdate = !!saved;

    // Validation — skip locked fields in edit mode
    let valid = true;
    if (!isUpdate) {
      [rsvpNameInput, rsvpPhoneInput, rsvpAttending].forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });
      if (!valid) return;
    }

    const isAttending = isUpdate ? saved.attending === 'yes' : rsvpAttending.value === 'yes';

    // Build form data
    const formData = {
      name: isUpdate ? saved.name : rsvpNameInput.value.trim(),
      phone: isUpdate ? saved.phone : rsvpPhoneInput.value.trim(),
      attending: isUpdate ? saved.attending : rsvpAttending.value,
      event: isAttending ? (isUpdate ? saved.event : (document.querySelector('input[name="event"]:checked')?.value || 'both')) : '',
      guestCount: isAttending ? rsvpGuestCount.value : '0',
      guestNames: [],
      message: isAttending ? rsvpMessageInput.value.trim() : '',
    };

    if (isAttending) {
      rsvpGuestNames.querySelectorAll('input').forEach(input => {
        if (input.value.trim()) formData.guestNames.push(input.value.trim());
      });
    }

    // Disable button
    rsvpSubmitBtn.disabled = true;
    rsvpSubmitBtn.textContent = 'Saving...';

    // Send to Google Sheet
    let sheetSuccess = false;
    if (GOOGLE_SCRIPT_URL) {
      try {
        const res = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        sheetSuccess = json.success;
      } catch {
        sheetSuccess = false;
      }
    }

    // Always save to localStorage as backup
    localStorage.setItem('rsvpSubmitted', JSON.stringify(formData));

    // Show result
    rsvpForm.style.display = 'none';
    if (isAttending) {
      rsvpSuccess.querySelector('h3').textContent = isUpdate ? 'Updated!' : 'Thank You!';
      rsvpSuccess.querySelector('p').innerHTML = isUpdate
        ? 'Your details have been updated.<br/>See you at the celebration!'
        : 'Your RSVP has been received.<br/>We can\'t wait to celebrate with you!';
      rsvpSuccess.style.display = '';
    } else {
      rsvpDecline.style.display = '';
    }
    openRsvpBtn.textContent = 'Update RSVP';

    // Show warning if sheet save failed
    if (GOOGLE_SCRIPT_URL && !sheetSuccess) {
      const warning = document.createElement('p');
      warning.style.cssText = 'color: #e67e22; font-size: 0.85rem; margin-top: 12px; font-family: var(--font-body);';
      warning.textContent = 'Note: There was an issue saving online. Your RSVP has been saved locally. Please try again later.';
      (isAttending ? rsvpSuccess : rsvpDecline).appendChild(warning);
    }
  });
});
