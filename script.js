/**
 * Vivek Shivaswamy - Executive Portfolio Logic
 * Handles interactive filtering, modals, theme toggling, counters, and contact interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('vs-portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('vs-portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      // Moon icon for switching to dark
      themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>`;
    } else {
      // Sun icon for switching to light
      themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>`;
    }
  }

  // 2. Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 3. Scroll Spy for Active Navigation Link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 4. Interactive Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1600; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(ease * target);
        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // 5. Experience Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const experienceCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      experienceCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Modal System
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalOpenTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Focus first input or close button
      const focusable = targetModal.querySelector('button, [href], input, select, textarea');
      if (focusable) focusable.focus();
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  modalOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      openModal(modalId);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-overlay.open');
      if (openModalEl) closeModal(openModalEl);
    }
  });

  // 7. Clipboard Copy with Toast Notification
  const copyButtons = document.querySelectorAll('[data-copy-value]');
  const toastEl = document.getElementById('toast-notification');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy-value');
      const label = btn.getAttribute('data-copy-label') || 'Copied to clipboard!';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`✓ ${label}`);
        }).catch(() => {
          fallbackCopyText(text, label);
        });
      } else {
        fallbackCopyText(text, label);
      }
    });
  });

  function fallbackCopyText(text, label) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`✓ ${label}`);
    } catch (err) {
      showToast(`Failed to copy`);
    }
    document.body.removeChild(textArea);
  }

  let toastTimeout;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // 8. Contact / Advisory Form Submission Simulation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Message Sent!</span>`;
        showToast("✓ Thank you! Vivek will respond shortly.");
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          const modal = contactForm.closest('.modal-overlay');
          if (modal) closeModal(modal);
        }, 1200);
      }, 1000);
    });
  }

  // 9. Native Print Trigger
  const printResumeBtns = document.querySelectorAll('.trigger-resume-print');
  printResumeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // 10. Tactile Glass Folder Vault Interaction
  const gfRoots = document.querySelectorAll('.gf-root');
  gfRoots.forEach(root => {
    // 3D Pointer Tilt
    root.addEventListener('pointermove', (e) => {
      const rect = root.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      root.style.setProperty('--gf-px', Math.max(-1, Math.min(1, px)).toFixed(3));
      root.style.setProperty('--gf-py', Math.max(-1, Math.min(1, py)).toFixed(3));
    });

    root.addEventListener('pointerleave', () => {
      root.style.setProperty('--gf-px', '0');
      root.style.setProperty('--gf-py', '0');
    });

    // Toggle Open State via Front Glass Hit Area
    const hitBtn = root.querySelector('.gf-hit');
    if (hitBtn) {
      hitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (root.hasAttribute('data-open')) {
          root.removeAttribute('data-open');
        } else {
          root.setAttribute('data-open', '');
        }
      });
    }

    // Interactive Sheets
    const sheets = root.querySelectorAll('.gf-sheet');
    sheets.forEach(sheet => {
      sheet.addEventListener('click', (e) => {
        e.stopPropagation();
        const docName = sheet.querySelector('.gf-sheet-name')?.textContent || 'Document';
        showToast(`📄 Inspected: ${docName}`);
      });
    });

    // Tactile Key Actions
    const keyBtn = root.querySelector('.gf-key');
    if (keyBtn) {
      keyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = root.querySelector('.gf-title')?.textContent || 'Folder';
        showToast(`⚡ Tactile Vault: Action on ${title}`);
      });
    }
  });
});
