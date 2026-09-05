
    // ===== TAB FILTER =====
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.nail-card');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.price === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // ===== LIGHTBOX (with prev/next + keyboard + swipe) =====
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lb-img');
    const lbName    = document.getElementById('lb-name');
    const lbPrice   = document.getElementById('lb-price');
    const lbCurrent = document.getElementById('lb-current');
    const lbTotal   = document.getElementById('lb-total');
    const lbSpinner = document.getElementById('lb-spinner');
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');

    // Track which cards are currently visible (filter-aware)
    function getVisibleCards() {
      return Array.from(cards).filter(c => c.style.display !== 'none');
    }
    let lbIndex = -1;
    let lbVisible = [];

    function showLightboxAt(i) {
      if (!lbVisible.length) return;
      // Wrap around
      lbIndex = ((i % lbVisible.length) + lbVisible.length) % lbVisible.length;
      const card  = lbVisible[lbIndex];
      const img   = card.querySelector('img');
      const name  = card.dataset.name  || 'Mẫu nail';
      const range = card.dataset.range || '';
      if (img && lbImg) {
        // Use w1400 (large) for lightbox quality
        lbImg.src = img.src.replace('=w400', '=w1400');
        lbImg.alt = name;
        // Show spinner until the big image finishes
        lbSpinner.classList.add('show');
        lbImg.style.opacity = '0';
        lbImg.onload = () => {
          lbSpinner.classList.remove('show');
          lbImg.style.opacity = '1';
        };
      }
      lbName.textContent  = name;
      lbPrice.textContent = range;
      lbCurrent.textContent = (lbIndex + 1).toString();
      lbTotal.textContent   = lbVisible.length.toString();
    }

    function openLightbox(card) {
      lbVisible = getVisibleCards();
      const i = lbVisible.indexOf(card);
      if (i === -1) return;
      lightbox.classList.add('active');
      showLightboxAt(i);
    }
    function closeLightbox() {
      lightbox.classList.remove('active');
      lbImg.onload = null;
    }
    function lightboxPrev() { showLightboxAt(lbIndex - 1); }
    function lightboxNext() { showLightboxAt(lbIndex + 1); }

    // Wire up cards → open
    cards.forEach(card => card.addEventListener('click', () => openLightbox(card)));

    // Mark gallery imgs as .loaded when they finish so they fade in
    // (CSS sets opacity:0 by default + transitions opacity on .loaded)
    document.querySelectorAll('.nail-card img').forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load',  () => img.classList.add('loaded'));
        img.addEventListener('error', () => img.classList.add('loaded'));
      }
    });

    // Wire up nav buttons
    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); lightboxPrev(); });
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); lightboxNext(); });

    // Backdrop click to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard: Esc close, ←/→ navigate
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   lightboxPrev();
      if (e.key === 'ArrowRight')  lightboxNext();
    });

    // Touch swipe: left/right to navigate — but ONLY for single-finger gestures.
    // Pinch-to-zoom (2+ fingers) was being misread as a swipe; we now cancel
    // tracking the moment a second finger lands.
    let swipeActive = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartId = null;
    lightbox.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        swipeActive  = true;
        touchStartX  = e.touches[0].screenX;
        touchStartY  = e.touches[0].screenY;
        touchStartId = e.touches[0].identifier;
      } else {
        swipeActive = false;        // multi-touch — definitely not a swipe
      }
    }, { passive: true });
    lightbox.addEventListener('touchmove', (e) => {
      // If user adds a 2nd finger mid-gesture (pinch), cancel the swipe
      if (e.touches.length > 1) swipeActive = false;
    }, { passive: true });
    lightbox.addEventListener('touchcancel', () => { swipeActive = false; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (!swipeActive) return;
      swipeActive = false;
      // Must be the same finger we started with, and all fingers up
      if (e.touches.length > 0) return;
      const t = Array.from(e.changedTouches).find(x => x.identifier === touchStartId);
      if (!t) return;
      const dx = t.screenX - touchStartX;
      const dy = t.screenY - touchStartY;
      // Horizontal swipe (filter out vertical scrolls and tiny accidental moves)
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx > 0) lightboxPrev();
        else        lightboxNext();
      }
    }, { passive: true });

    // ===== HAMBURGER MENU =====
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navBackdrop = document.getElementById('nav-backdrop');
    function closeMobileMenu() {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navBackdrop.classList.remove('active');
    }
    function openMobileMenu() {
      navToggle.classList.add('active');
      navLinks.classList.add('active');
      navBackdrop.classList.add('active');
    }
    navToggle.addEventListener('click', () => {
      navLinks.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
    navBackdrop.addEventListener('click', closeMobileMenu);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

    // ===== LOADING SPLASH (V2 — true position sync) =====
    // Measure where hero h1 actually renders, compute the exact translateY + scale
    // needed to land splash h1 on top of it. Write the values into CSS vars used
    // by the splash-h1-morph keyframes. Re-run on resize so it survives orientation
    // changes mid-splash.
    function syncSplashH1ToHeroH1() {
      const heroH1 = document.querySelector('.hero h1');
      const splashH1 = document.querySelector('.splash-h1');
      if (!heroH1 || !splashH1) return;

      // Temporarily clear any transform so we measure the pre-morph splash position.
      const prevTransform = splashH1.style.transform;
      splashH1.style.transform = 'none';

      // Logo version: measure the LOGO IMAGES (fall back to the h1 box if absent),
      // so the splash logo morphs to land exactly on the hero logo.
      const heroEl = heroH1.querySelector('img') || heroH1;
      const splashEl = splashH1.querySelector('img') || splashH1;
      const heroRect = heroEl.getBoundingClientRect();
      const splashRect = splashEl.getBoundingClientRect();

      splashH1.style.transform = prevTransform;

      if (!heroRect.height || !splashRect.height) return;

      const heroCenterY  = heroRect.top  + heroRect.height  / 2;
      const splashCenterY = splashRect.top + splashRect.height / 2;

      // SCALE: match the splash logo height to the hero logo height.
      const scale = heroRect.height / splashRect.height;

      // TRANSLATE: align the vertical centers of the two logos.
      const offsetY = heroCenterY - splashCenterY;

      const root = document.documentElement;
      root.style.setProperty('--splash-h1-target-y', offsetY.toFixed(2) + 'px');
      root.style.setProperty('--splash-h1-target-scale', scale.toFixed(4));
    }

    // Run once when fonts + layout are stable, plus on resize.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncSplashH1ToHeroH1);
    } else {
      window.addEventListener('load', syncSplashH1ToHeroH1);
    }
    syncSplashH1ToHeroH1();   // first attempt synchronously in case fonts already cached
    window.addEventListener('resize', syncSplashH1ToHeroH1, { passive: true });

    // Mobile splash runs sequentially (curtain → text+slogans → hero) and is
    // longer than desktop's overlapping version. Different timings per viewport.
    // IMPORTANT: schedule with setTimeout directly (NOT inside window.load) so
    // splash hides on a fixed deadline even if a remote image is slow/blocked.
    // The script tag is at the end of <body>, so the DOM exists by now.
    {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const splashHideAt  = isMobile ? 4100 : 3500;
      const driftActiveAt = isMobile ? 5500 : 4900;

      setTimeout(() => {
        const sp = document.getElementById('splash');
        if (sp) sp.classList.add('hidden');
      }, splashHideAt);
      setTimeout(() => {
        if (typeof window.__activateHeroDrift === 'function') {
          window.__activateHeroDrift();
        }
      }, driftActiveAt);
    }

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    }, { passive: true });

    // ===== TEXT REVEAL LETTERS (HERO H1) =====
    // (function() {
    // const h1 = document.querySelector('.hero h1');
    // if (!h1) return;
    // const newChildren = [];
    // let charIndex = 0;
    // h1.childNodes.forEach(node => {
    // if (node.nodeType === 3) { // text node
    // [...node.textContent].forEach(ch => {
    // const span = document.createElement('span');
    // span.className = 'letter';
    // span.textContent = ch === ' ' ? ' ' : ch;
    // span.style.animationDelay = (2.3 + charIndex * 0.06) + 's';
    // charIndex++;
    // newChildren.push(span);
    // });
    // } else {
    // newChildren.push(node.cloneNode(true));
    // }
    // });
    // h1.innerHTML = '';
    // newChildren.forEach(c => h1.appendChild(c));
    // })();

    // ===== CURSOR SPARKLE TRAIL =====
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (!isTouch) {
      let lastSpawn = 0;
      document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastSpawn < 60) return;
        lastSpawn = now;
        const s = document.createElement('div');
        s.className = 'cursor-sparkle';
        s.style.left = (e.clientX + (Math.random() - 0.5) * 12) + 'px';
        s.style.top = (e.clientY + (Math.random() - 0.5) * 12) + 'px';
        const size = 2 + Math.random() * 3;
        s.style.width = s.style.height = size + 'px';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1000);
      }, { passive: true });
    }

    // ===== MAGNETIC BUTTONS =====
    if (!isTouch) {
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });
    }

    // ===== HERO 3D — Ambient drift + mouse + gyroscope =====
    const hero = document.getElementById('hero');
    const heroScene = document.getElementById('hero-scene');
    const heroSpot = document.getElementById('hero-spotlight');
    if (hero && heroScene) {
      let mx = 0, my = 0;     // mouse offset (-0.5 to 0.5)
      let gx = 0, gy = 0;     // gyroscope offset
      let cx = 0, cy = 0;     // raw cursor for spotlight
      const startTime = performance.now();

      // Desktop: mouse moves the scene
      if (!isTouch) {
        hero.addEventListener('mousemove', (e) => {
          const rect = hero.getBoundingClientRect();
          mx = (e.clientX - rect.left) / rect.width - 0.5;
          my = (e.clientY - rect.top) / rect.height - 0.5;
          cx = e.clientX - rect.left;
          cy = e.clientY - rect.top;
        });
        hero.addEventListener('mouseleave', () => { mx = 0; my = 0; });
      }

      // Mobile: gyroscope — tilt phone to rotate scene
      function startGyro() {
        window.addEventListener('deviceorientation', (e) => {
          // beta = front/back tilt (-180..180), gamma = left/right (-90..90)
          if (e.gamma !== null && e.beta !== null) {
            gx = Math.max(-1, Math.min(1, e.gamma / 35));
            gy = Math.max(-1, Math.min(1, (e.beta - 50) / 35));
          }
        }, true);
      }
      if (isTouch) {
        // iOS 13+ requires explicit permission triggered by user gesture
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
          // Add an invisible activation prompt that waits for first tap
          const prompt = () => {
            DeviceOrientationEvent.requestPermission().then(state => {
              if (state === 'granted') startGyro();
            }).catch(() => {});
            document.removeEventListener('touchstart', prompt);
            document.removeEventListener('click', prompt);
          };
          document.addEventListener('touchstart', prompt, { once: true });
          document.addEventListener('click', prompt, { once: true });
        } else {
          startGyro();
        }
      }

      // Ambient drift (rất nhẹ, không gây chóng mặt) + mouse + gyroscope blend.
      // V3: hold still during splash so the splash→hero h1 hand-off lands on a
      // perfectly stationary target. Drift starts only after splash is hidden.
      let driftActive = false;
      let driftStartTime = 0;
      function loop(now) {
        if (driftActive) {
          const t = (now - driftStartTime) / 1000;
          const driftX = Math.sin(t * 0.5) * 0.8;
          const driftY = Math.cos(t * 0.4) * 0.5;
          const rotX = -my * 6 + driftY + gy * 4;
          const rotY =  mx * 6 + driftX + gx * 4;
          heroScene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
          if (heroSpot && !isTouch) {
            heroSpot.style.transform = `translate(${cx - 320}px, ${cy - 320}px)`;
          }
        }
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      // Expose activator so the splash-hide timer can flip drift on
      window.__activateHeroDrift = (when) => {
        driftStartTime = when || performance.now();
        driftActive = true;
      };

      // Scroll parallax: hero fades when scrolling away
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          const fade = Math.max(0, 1 - scrolled / (window.innerHeight * 0.95));
          heroScene.style.opacity = fade;
        }
      }, { passive: true });
    }

    // Curtain reveal disabled — gây đen ảnh khi nhiều cards

    // ===== HERO SPARKLES (giảm trên mobile để tiết kiệm pin) =====
    const sparklesContainer = document.querySelector('.hero-sparkles');
    if (sparklesContainer) {
      const sparkleCount = isTouch ? 6 : 16;
      for (let i = 0; i < sparkleCount; i++) {
        const s = document.createElement('span');
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 3 + 's';
        s.style.animationDuration = (2.5 + Math.random() * 3) + 's';
        const size = 1 + Math.random() * 3;
        s.style.width = s.style.height = size + 'px';
        sparklesContainer.appendChild(s);
      }
    }

    // ===== 3D TILT ON NAIL CARDS =====
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
      document.querySelectorAll('.nail-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    // ===== TRUST STATS COUNT-UP =====
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.num[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            let current = 0;
            const duration = 1500;
            const startTime = performance.now();
            function update(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              current = target * eased;
              el.textContent = Math.floor(current) + suffix;
              if (progress < 1) requestAnimationFrame(update);
              else el.textContent = target + suffix;
            }
            requestAnimationFrame(update);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    const statsSection = document.querySelector('.stats');
    if (statsSection) statsObserver.observe(statsSection);

    // ===== BOOKING FORM =====
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('b-date');
    if (dateInput) dateInput.min = today;
    let bookingTrigger = null;

    const bookingAnalyticsEvents = new Set([
      'booking_request_prepared',
      'booking_copy_success',
      'booking_copy_failure',
      'contact_click'
    ]);

    function trackBookingEvent(name, parameters) {
      if (!bookingAnalyticsEvents.has(name)) return;
      const safeParameters = name === 'contact_click'
        ? {
            channel: parameters && parameters.channel,
            placement: parameters && parameters.placement,
            language: parameters && parameters.language
          }
        : undefined;
      try {
        if (safeParameters) window.gtag('event', name, safeParameters);
        else window.gtag('event', name);
      } catch (err) {}
    }

    function bookingLanguage() {
      return document.documentElement.getAttribute('data-lang') === 'vi' ? 'vi' : 'en';
    }

    function setCopyStatus(state) {
      const status = document.getElementById('booking-copy-status');
      if (!status) return;
      const lang = bookingLanguage();
      const messages = {
        vi: {
          ready: 'Tin nhắn đang sẵn sàng để bạn copy.',
          success: 'Đã copy tin nhắn. Mở Zalo, dán rồi gửi; lịch chỉ được xác nhận khi tiệm trả lời.',
          failure: 'Không thể tự copy. Bạn vẫn có thể bôi đen tin nhắn bên trên để tự copy, rồi mở Zalo và gửi.'
        },
        en: {
          ready: 'Your message is ready to copy.',
          success: 'Message copied. Open Zalo, paste and send it; your appointment is confirmed only when the salon replies.',
          failure: 'We could not copy it automatically. Select the message above to copy it yourself, then open Zalo and send it.'
        }
      };
      status.textContent = messages[lang][state];
    }

    document.getElementById('booking-form').addEventListener('submit', (e) => {
      e.preventDefault();
      bookingTrigger = e.submitter || document.activeElement;
      const name = document.getElementById('b-name').value.trim();
      const phone = document.getElementById('b-phone').value.trim();
      const date = document.getElementById('b-date').value;
      const time = document.getElementById('b-time').value;
      const service = document.getElementById('b-service').value;
      const note = document.getElementById('b-note').value.trim();

      const lang = bookingLanguage();
      const dateFormatted = date;
      const message = lang === 'en'
        ? `Hello The Nail! I would like to request an appointment:\n• Name: ${name}\n• Phone: ${phone}\n• Date: ${dateFormatted}\n• Time: ${time}\n• Service: ${service}${note ? '\n• Note: ' + note : ''}\n`
        : `Chào The Nail! Em muốn yêu cầu đặt lịch:\n• Tên: ${name}\n• SĐT: ${phone}\n• Ngày: ${dateFormatted}\n• Giờ: ${time}\n• Dịch vụ: ${service}${note ? '\n• Ghi chú: ' + note : ''}\n`;

      const preview = document.getElementById('message-preview');
      preview.value = message;
      window._pendingMessage = message;
      document.getElementById('booking-modal').classList.add('active');
      preview.focus();
      preview.select();
      setCopyStatus('ready');
      trackBookingEvent('booking_request_prepared');
    });

    function closeBookingModal() {
      document.getElementById('booking-modal').classList.remove('active');
      if (bookingTrigger && document.contains(bookingTrigger)) bookingTrigger.focus();
    }

    async function sendToZalo() {
      const msg = window._pendingMessage || '';
      const preview = document.getElementById('message-preview');
      try {
        if (!msg || !navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(msg);
        setCopyStatus('success');
        trackBookingEvent('booking_copy_success');
      } catch (err) {
        if (preview) {
          preview.focus();
          preview.select();
        }
        setCopyStatus('failure');
        trackBookingEvent('booking_copy_failure');
      }
    }

    document.getElementById('booking-modal').addEventListener('click', (e) => {
      if (e.target.id === 'booking-modal') closeBookingModal();
    });

    document.getElementById('booking-modal').addEventListener('keydown', (e) => {
      const modal = e.currentTarget;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeBookingModal();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = [].slice.call(modal.querySelectorAll('textarea, button:not([disabled]), a[href]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-contact-channel]');
      if (!link) return;
      trackBookingEvent('contact_click', {
        channel: link.dataset.contactChannel,
        placement: link.dataset.contactPlacement,
        language: bookingLanguage()
      });
    });

    // ===== PARALLAX nền màu: ĐÃ GỠ (đốm màu nhìn như vết loang). Sẽ làm lại bản đúng theo reference của user. =====

    // ===== HOVER: ảnh BAY từ ô thẻ ra GIỮA màn hình (FLIP). Thẻ gốc ĐỨNG YÊN → không nháy. =====
    (() => {
      const zoom = document.getElementById('card-zoom');
      const cards = [...document.querySelectorAll('.scatter-card')];
      if (!zoom || !cards.length) return;
      const zImg = zoom.querySelector('img');
      const zTag = zoom.querySelector('.cz-tag');
      let openCard = null;
      const dims = () => {
        const W = Math.min(window.innerWidth * 0.56, 420);
        return { W, H: W * 4 / 3 };
      };
      const cardTf = (cr, W) => 'translate(' + cr.left.toFixed(0) + 'px,' + cr.top.toFixed(0) + 'px) scale(' + (cr.width / W).toFixed(3) + ')';
      const centerTf = (W, H) => 'translate(' + ((window.innerWidth - W) / 2).toFixed(0) + 'px,' + ((window.innerHeight - H) / 2).toFixed(0) + 'px) scale(1)';
      function open(card) {
        openCard = card;
        const cimg = card.querySelector('img');
        const cr = cimg.getBoundingClientRect();
        const { W, H } = dims();
        zImg.src = cimg.currentSrc || cimg.src;
        const tag = card.querySelector('.tag');
        zTag.textContent = tag ? tag.textContent : '';
        zTag.style.left = ((window.innerWidth - W) / 2 + 14).toFixed(0) + 'px';
        zTag.style.top = ((window.innerHeight - H) / 2 + H - 38).toFixed(0) + 'px';
        // đặt ảnh TRÙNG ô thẻ (không transition)
        zoom.classList.remove('flying');
        zImg.style.transform = cardTf(cr, W);
        zoom.classList.add('show');
        void zImg.offsetWidth;                 // ép reflow
        zoom.classList.add('flying');
        zImg.style.transform = centerTf(W, H); // BAY ra giữa
      }
      function close(card) {
        if (openCard !== card) return;
        const cimg = card.querySelector('img');
        const cr = cimg.getBoundingClientRect();
        const { W } = dims();
        zoom.classList.add('flying');
        zImg.style.transform = cardTf(cr, W); // bay về ô thẻ
        zoom.classList.remove('show');
        openCard = null;
      }
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => open(card));
        card.addEventListener('mouseleave', () => close(card));
      });
    })();

    // ===== TỐI ƯU FPS: tạm dừng animation trôi của thẻ hero khi cuộn ra khỏi hero =====
    (() => {
      const heroEl = document.getElementById('hero');
      if (!heroEl || !('IntersectionObserver' in window)) return;
      const floats = [...document.querySelectorAll('.sc-float')];
      const spark = document.querySelector('.hero-sparkles');
      new IntersectionObserver(([e]) => {
        const st = e.isIntersecting ? 'running' : 'paused';
        floats.forEach(f => f.style.animationPlayState = st);
        if (spark) spark.style.animationPlayState = st;
      }, { threshold: 0 }).observe(heroEl);
    })();

  
  // NAV thu gọn khi cuộn (bản B): thêm/bỏ class .compact theo vị trí cuộn
  (function () {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var isCompact = false, tick = false;
    function apply() {
      var should = window.scrollY > 40;
      if (should !== isCompact) { isCompact = should; nav.classList.toggle('compact', isCompact); }
      tick = false;
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(apply); } }, { passive: true });
    apply();
  })();

  // GALLERY: thêm nhãn "Bộ sưu tập" vào thanh bộ lọc (thanh này sẽ ghim lại khi cuộn; tiêu đề lớn cuộn đi)
  (function () {
    var tw = document.querySelector('section#gallery .tabs-wrap');
    if (!tw || tw.querySelector('.g-title')) return;
    var t = document.createElement('span');
    t.className = 'g-title'; t.textContent = 'Bộ sưu tập';
    tw.insertBefore(t, tw.firstChild);
  })();

  // ===== MOBILE: dải ảnh nail 2 HÀNG chạy ngược chiều (thay thẻ rải hero) + gợi ý cuộn xuống =====
  (function () {
    var hero = document.getElementById('hero'); if (!hero) return;
    var cards = [].slice.call(hero.querySelectorAll('.scatter-card'));
    if (!cards.length || hero.querySelector('.hero-strip-m')) return;
    function makeFig(c) {
      var img = c.querySelector('img'); if (!img) return null;
      var fig = document.createElement('figure');
      var im = document.createElement('img');
      im.src = img.src.replace('=w600', '=w400'); im.alt = ''; im.loading = 'lazy'; im.setAttribute('referrerpolicy', 'no-referrer');
      fig.appendChild(im);
      var tag = c.querySelector('.tag');
      if (tag) { var s = document.createElement('span'); s.textContent = tag.textContent; fig.appendChild(s); }
      return fig;
    }
    function makeTrack(list, cls) {
      var t = document.createElement('div'); t.className = 'hero-strip-track' + (cls ? ' ' + cls : '');
      [list, list].forEach(function (set) { set.forEach(function (c) { var f = makeFig(c); if (f) t.appendChild(f); }); });  // x2 loop liền mạch
      return t;
    }
    var strip = document.createElement('div'); strip.className = 'hero-strip-m'; strip.setAttribute('aria-hidden', 'true');
    strip.appendChild(makeTrack(cards, ''));                 // hàng 1
    strip.appendChild(makeTrack(cards.slice().reverse(), 'r2'));  // hàng 2 (ngược chiều + đảo thứ tự)
    hero.appendChild(strip);

    var cue = document.createElement('div'); cue.className = 'hero-scroll-cue'; cue.setAttribute('aria-hidden', 'true');
    cue.innerHTML = '<span>Cuộn xuống</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
    hero.appendChild(cue);
  })();

  // ===== MOBILE: reveal khi cuộn tới (fade-up + phóng nhẹ + stagger) — thay chuyển động stack =====
  (function () {
    if (window.innerWidth > 820 || !('IntersectionObserver' in window)) return;
    var els = [].slice.call(document.querySelectorAll('.section-head, .about-item, .menu-cat, .menu-foot, .contact-info, .map-col, .booking-form, #gallery-grid .nail-card'));
    if (!els.length) return;
    els.forEach(function (el) { el.classList.add('reveal-m'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = el.parentNode ? [].slice.call(el.parentNode.children) : [];
        var idx = sibs.indexOf(el);
        el.style.transitionDelay = ((idx > 0 ? idx % 6 : 0) * 0.07) + 's';   // stagger nhẹ trong nhóm
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  // ===== ĐỔI NGÔN NGỮ VI / EN =====
  (function () {
    var DICT = [
      ['nav .links a[href="#about"]', 'About'],
      ['nav .links a[href="#contact"]', 'Contact'],
      ['nav .links a[href="#gallery"]', 'Gallery'],
      ['nav .links a[href="#booking"]', 'Book now'],
      ['.nav-info .addr', '📍 District 10, HCMC'],
      ['section.about .section-head .label', '— Our values —'],
      ['section.about .section-head h2', 'Every hand — a masterpiece'],
      ['section.about .section-head p', 'At The Nail, every set of nails blends your idea with our craftsmanship.'],
      ['.about-item:nth-of-type(1) h3', 'Personalized'],
      ['.about-item:nth-of-type(1) p', 'Every client is unique. Each set is tailored to your taste, hand shape and style.'],
      ['.about-item:nth-of-type(2) h3', 'Creative'],
      ['.about-item:nth-of-type(2) p', 'Beyond templates — we craft a design that is uniquely yours.'],
      ['.about-item:nth-of-type(3) h3', 'Meticulous'],
      ['.about-item:nth-of-type(3) p', 'Every detail refined. Beautiful nails come from patience — never rushed.'],
      ['section#gallery .section-head h2 em', 'Gallery'],
      ['section#gallery .section-head p', 'Every hand, a signature. Find inspiration for your own style.'],
      ['section#gallery .tabs-wrap .g-title', 'Gallery'],
      ['.tabs-wrap .tab[data-filter="all"]', 'All'],
      ['section#booking .section-head .label', '— Booking —'],
      ['section#booking .section-head h2', 'Book your appointment'],
      ['section#booking .section-head p', 'Share your details, then copy and send the prepared request in Zalo. Your appointment is confirmed only when the salon replies.'],
      ['label[for="b-name"]', 'Full name'],
      ['label[for="b-phone"]', 'Phone number'],
      ['label[for="b-date"]', 'Date'],
      ['label[for="b-time"]', 'Time'],
      ['label[for="b-service"]', 'Service'],
      ['label[for="b-note"]', 'Note (optional)'],
      ['.booking-form button[type="submit"]', 'Prepare Zalo request →'],
      ['section.contact .section-head .label', '— Contact —'],
      ['section.contact .section-head h2', 'Visit The Nail'],
      ['section.contact .section-head p', 'Book ahead via Zalo / Instagram for priority hours and design advice.'],
      ['.contact-info h3', 'Contact info'],
      ['.contact-info .info-row:nth-child(2) .label', 'Address'],
      ['.contact-info .info-row:nth-child(3) .label', 'Phone / Zalo'],
      ['.contact-info .info-row:nth-child(4) .label', 'Opening hours'],
      ['.contact-info .info-row:nth-child(4) .value', 'Mon — Sun · 9:00 — 22:00'],
      ['.map-actions a[href*="maps"]', 'Directions →'],
      ['.map-actions a[href*="zalo"]', 'Ask on Zalo'],
      ['footer .brand + div', '© 2026 thenail.vn · District 10, Saigon · All rights reserved'],
      ['.mbar-item:nth-of-type(2) span', 'Designs'],
      ['.mbar-item:nth-of-type(3) span', 'Contact'],
      ['.mbar-cta span', 'Message Zalo'],
      ['.hero-scroll-cue span', 'Scroll']
    ];
    DICT.forEach(function (e) {
      var el = document.querySelector(e[0]);
      if (el && !el.hasAttribute('data-en')) el.setAttribute('data-en', e[1]);
    });
    var nodes = [].slice.call(document.querySelectorAll('[data-en],[data-vi]'));
    nodes.forEach(function (el) {
      if (!el.hasAttribute('data-vi')) el.setAttribute('data-vi', el.textContent);
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent);
    });
    var phNodes = [].slice.call(document.querySelectorAll('[data-en-ph]'));
    phNodes.forEach(function (el) { if (!el.hasAttribute('data-vi-ph')) el.setAttribute('data-vi-ph', el.getAttribute('placeholder') || ''); });
    function setLang(lang) {
      document.documentElement.setAttribute('data-lang', lang);
      nodes.forEach(function (el) {
        var t = el.getAttribute(lang === 'en' ? 'data-en' : 'data-vi');
        if (t != null) el.textContent = t;
      });
      phNodes.forEach(function (el) {
        var p = el.getAttribute(lang === 'en' ? 'data-en-ph' : 'data-vi-ph');
        if (p != null) el.setAttribute('placeholder', p);
      });
      [].forEach.call(document.querySelectorAll('.lang-toggle span[data-l]'), function (s) {
        s.classList.toggle('on', s.getAttribute('data-l') === lang);
      });
      try { localStorage.setItem('tn-lang', lang); } catch (err) {}
    }
    [].forEach.call(document.querySelectorAll('.lang-toggle'), function (b) {
      b.addEventListener('click', function () {
        setLang(document.documentElement.getAttribute('data-lang') === 'en' ? 'vi' : 'en');
      });
    });
    /* Chi HIEN tieng Anh, KHONG ghi de lua chon da luu.
       Truoc day khach Viet lo vao /en/ mot lan la thenail.vn hien tieng Anh vinh vien. */
    var luaChonCu = null; try { luaChonCu = localStorage.getItem('tn-lang'); } catch (e) {}
    setLang('en');
    try {
      if (luaChonCu === null) localStorage.removeItem('tn-lang');
      else localStorage.setItem('tn-lang', luaChonCu);
    } catch (e) {}
  })();
