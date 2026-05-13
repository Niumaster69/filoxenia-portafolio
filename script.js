/* ============================================================
   FILOXENIA — Portfolio Scripts
   Vanilla JavaScript (sin dependencias)
   ============================================================ */

(function () {
    'use strict';

    /* ===== Loader ===== */
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => loader.classList.add('hidden'), 800);
        }
    });

    /* ===== Particles ===== */
    const particlesCanvas = document.getElementById('particles');
    if (particlesCanvas) {
        const ctx = particlesCanvas.getContext('2d');
        let particles = [];
        let animationId;
        let width, height;

        function resizeCanvas() {
            width = particlesCanvas.width = window.innerWidth;
            height = particlesCanvas.height = window.innerHeight;
        }

        function createParticles() {
            particles = [];
            const count = Math.min(Math.floor((width * height) / 15000), 80);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            const isDark = !document.documentElement.getAttribute('data-theme') ||
                           document.documentElement.getAttribute('data-theme') === 'dark';
            const color = isDark ? '0, 212, 255' : '123, 47, 247';

            particles.forEach((p, i) => {
                // Actualizar posición
                p.x += p.vx;
                p.y += p.vy;

                // Rebote en bordes
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Dibujar partícula
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();

                // Conectar partículas cercanas
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[j].x - p.x;
                    const dy = particles[j].y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            animationId = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }

    /* ===== Theme Toggle ===== */
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('filoxenia-theme');
    document.documentElement.setAttribute('data-theme', savedTheme || 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('filoxenia-theme', next);
        });
    }

    /* ===== Navbar ===== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    const navSubLinks = document.querySelectorAll('.navbar__sublink');
    const navDropdowns = document.querySelectorAll('.navbar__dropdown');
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Dropdown toggle (en mobile expande el submenú; en desktop usa hover CSS)
    navDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.navbar__link--has-sub');
        if (!trigger) return;
        trigger.addEventListener('click', (e) => {
            if (isMobile()) {
                e.preventDefault();
                // cerrar otros dropdowns abiertos
                navDropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('open'); });
                dropdown.classList.toggle('open');
            }
        });
    });

    // Cerrar menú/dropdowns al hacer clic en un enlace de navegación
    const closeMenu = () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        navDropdowns.forEach(d => d.classList.remove('open'));
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Si el link es la cabecera de un dropdown en mobile, no cerrar (ya lo maneja el toggle)
            if (link.classList.contains('navbar__link--has-sub') && isMobile()) return;
            closeMenu();
        });
    });
    navSubLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar dropdowns al click fuera (desktop)
    document.addEventListener('click', (e) => {
        if (isMobile()) return;
        if (!e.target.closest('.navbar__dropdown')) {
            navDropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    /* ===== Active Nav Link on Scroll (con sub-secciones) ===== */
    // Incluir secciones tradicionales + los sub-anchors del Marco Lógico, Variables y RAE
    const subAnchors = document.querySelectorAll('.ml-step[id], .var-block[id], #rae-doc, #articulos');
    const allSections = [...document.querySelectorAll('section[id]'), ...subAnchors];

    function getOffsetTop(el) {
        let top = 0;
        while (el) { top += el.offsetTop; el = el.offsetParent; }
        return top;
    }

    function updateActiveLink() {
        const scrollPos = window.scrollY + 120;
        let activeId = null;

        allSections.forEach(section => {
            const top = getOffsetTop(section);
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                activeId = id;
            }
        });

        if (!activeId) return;

        // limpia activos
        navLinks.forEach(link => link.classList.remove('active'));
        navSubLinks.forEach(link => link.classList.remove('active'));

        // marca el sublink activo (si aplica) y propaga al dropdown padre
        const activeSubLink = document.querySelector(`.navbar__sublink[href="#${activeId}"]`);
        if (activeSubLink) {
            activeSubLink.classList.add('active');
            const parentDropdown = activeSubLink.closest('.navbar__dropdown');
            const parentLink = parentDropdown?.querySelector('.navbar__link--has-sub');
            if (parentLink) parentLink.classList.add('active');
            return;
        }

        // si no hay sublink, marca el link directo
        const activeLink = document.querySelector(`.navbar__link[href="#${activeId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    window.addEventListener('scroll', updateActiveLink);

    /* ===== Counter Animation ===== */
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                counter.dataset.animated = 'true';
                const target = parseInt(counter.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    const eased = 1 - Math.pow(2, -10 * progress);
                    counter.textContent = Math.round(target * eased);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(update);
            }
        });
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    /* ===== AOS (Animate On Scroll) - Custom Implementation ===== */
    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    initAOS();

    /* ===== Parallax Effect ===== */
    function handleParallax() {
        const scrollY = window.scrollY;
        const parallaxBg = document.querySelector('.hero__parallax-bg');
        const problemaBg = document.querySelector('.problema__bg');
        const impactoBg = document.querySelector('.impacto__bg');

        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        if (problemaBg) {
            const offset = problemaBg.closest('.parallax-section').offsetTop;
            problemaBg.style.transform = `translateY(${(scrollY - offset) * 0.15}px)`;
        }
        if (impactoBg) {
            const offset = impactoBg.closest('.parallax-section').offsetTop;
            impactoBg.style.transform = `translateY(${(scrollY - offset) * 0.15}px)`;
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    /* ===== Filter System (Requisitos y Galería) ===== */
    function initFilters(containerSelector, itemSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const filterBtns = container.querySelectorAll('.filter-btn');
        const section = container.closest('.section');
        const items = section ? section.querySelectorAll(itemSelector) : [];

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Actualizar botones activos
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filtrar items
                items.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                        item.style.display = '';
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    initFilters('.requisitos__filters', '.req-card');
    initFilters('.galeria__filters', '.galeria__item');

    /* ===== Lightbox ===== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    let currentLightboxIndex = 0;
    let lightboxItems = [];

    function openLightbox(index) {
        if (!lightbox || !lightboxItems.length) return;
        currentLightboxIndex = index;
        const item = lightboxItems[index];

        lightboxImg.src = item.img;
        lightboxImg.alt = item.title;
        lightboxTitle.textContent = item.title;
        lightboxDesc.textContent = item.desc;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        currentLightboxIndex = (currentLightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
        openLightbox(currentLightboxIndex);
    }

    // Vincular items de la galería al lightbox
    const galeriaItems = document.querySelectorAll('.galeria__item');
    galeriaItems.forEach((item, i) => {
        const placeholder = item.querySelector('.galeria__placeholder');
        lightboxItems.push({
            img: item.dataset.img || '',
            title: placeholder ? placeholder.querySelector('span')?.textContent : '',
            desc: placeholder ? placeholder.querySelector('p')?.textContent : ''
        });

        item.addEventListener('click', () => openLightbox(i));
    });

    // Vincular figuras del Marco Lógico al lightbox
    const mlFigures = document.querySelectorAll('.ml-figure');
    mlFigures.forEach(fig => {
        const img = fig.querySelector('img');
        const caption = fig.querySelector('figcaption');
        if (!img) return;
        const idx = lightboxItems.length;
        lightboxItems.push({
            img: img.getAttribute('src'),
            title: img.getAttribute('alt') || 'Diagrama Marco Lógico',
            desc: caption ? caption.textContent : ''
        });
        img.addEventListener('click', () => openLightbox(idx));
    });

    if (lightbox) {
        lightbox.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__prev')?.addEventListener('click', () => navigateLightbox(-1));
        lightbox.querySelector('.lightbox__next')?.addEventListener('click', () => navigateLightbox(1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Teclado: Escape cierra lightbox, flechas navegan
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    /* ===== Document Preview ===== */
    const docPreview = document.getElementById('docPreview');
    const docPreviewTitle = document.getElementById('docPreviewTitle');
    const docPreviewFrame = document.getElementById('docPreviewFrame');
    const docPreviewDownload = document.getElementById('docPreviewDownload');
    const docPreviewLoader = document.getElementById('docPreviewLoader');
    const docPreviewClose = document.getElementById('docPreviewClose');

    function getPreviewUrl(filePath) {
        const ext = filePath.split('.').pop().toLowerCase();
        const isPdf = ext === 'pdf';
        const isLocal = window.location.protocol === 'file:' ||
                        window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';

        if (isLocal) {
            // En local, no se pueden previsualizar con viewer externo
            return null;
        }

        const fullUrl = new URL(filePath, window.location.href).href;

        if (isPdf) {
            // PDFs usan Google Docs Viewer
            return 'https://docs.google.com/gview?url=' + encodeURIComponent(fullUrl) + '&embedded=true';
        }

        // Office files usan Microsoft Office Online Viewer
        return 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(fullUrl);
    }

    function openDocPreview(filePath, title) {
        if (!docPreview) return;

        const previewUrl = getPreviewUrl(filePath);

        docPreviewTitle.textContent = title;
        docPreviewDownload.href = filePath;
        docPreviewLoader.classList.remove('hidden');

        if (!previewUrl) {
            // No se puede previsualizar en local, mostrar mensaje
            docPreviewFrame.srcdoc = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;font-family:Inter,sans-serif;color:#4e5578;text-align:center;padding:40px;">
                    <div style="font-size:4rem;margin-bottom:20px;">📄</div>
                    <h3 style="margin-bottom:8px;color:#1b1f3b;">Vista previa no disponible en local</h3>
                    <p style="max-width:400px;line-height:1.6;">Los archivos (PDF, DOCX, PPTX, XLSX) requieren que el sitio esté desplegado en un servidor para poder previsualizarse.<br><br>Puedes descargar el archivo usando el botón de arriba.</p>
                </div>`;
            docPreviewLoader.classList.add('hidden');
        } else {
            docPreviewFrame.src = previewUrl;
            docPreviewFrame.onload = () => {
                docPreviewLoader.classList.add('hidden');
            };
        }

        docPreview.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDocPreview() {
        if (!docPreview) return;
        docPreview.classList.remove('active');
        document.body.style.overflow = '';
        // Limpiar iframe
        setTimeout(() => {
            docPreviewFrame.src = '';
            docPreviewFrame.srcdoc = '';
        }, 300);
    }

    // Vincular botones de vista previa
    document.querySelectorAll('[data-file]').forEach(btn => {
        btn.addEventListener('click', () => {
            openDocPreview(btn.dataset.file, btn.dataset.title);
        });
    });

    if (docPreviewClose) {
        docPreviewClose.addEventListener('click', closeDocPreview);
    }

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && docPreview && docPreview.classList.contains('active')) {
            closeDocPreview();
        }
    });

    /* ===== Scroll to Top ===== */
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ===== Smooth Scroll for Internal Links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ===== Floating Video Player (Ventana Flotante) ===== */
    const videoLauncher = document.getElementById('videoLauncher');
    const floatingVideo = document.getElementById('floatingVideo');
    const floatingVideoEl = document.getElementById('floatingVideoEl');
    const floatingVideoSource = document.getElementById('floatingVideoSource');
    const floatingVideoIframe = document.getElementById('floatingVideoIframe');
    const floatingVideoTitle = document.getElementById('floatingVideoTitle');
    const floatingVideoHeader = document.getElementById('floatingVideoHeader');
    const floatingVideoClose = document.getElementById('floatingVideoClose');
    const floatingVideoMin = document.getElementById('floatingVideoMin');
    const floatingVideoMax = document.getElementById('floatingVideoMax');
    const floatingVideoResize = document.getElementById('floatingVideoResize');

    function openFloatingVideo(src, title, isEmbed) {
        if (!floatingVideo) return;
        floatingVideoTitle.textContent = title || 'Video';
        if (isEmbed) {
            floatingVideoEl.hidden = true;
            floatingVideoEl.pause();
            floatingVideoIframe.hidden = false;
            floatingVideoIframe.src = src;
        } else {
            floatingVideoIframe.hidden = true;
            floatingVideoIframe.src = '';
            floatingVideoEl.hidden = false;
            floatingVideoSource.src = src;
            floatingVideoEl.load();
            const playPromise = floatingVideoEl.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => { /* autoplay bloqueado, usuario debe pulsar play */ });
            }
        }
        floatingVideo.hidden = false;
        floatingVideo.classList.remove('floating-video--minimized', 'floating-video--maximized');
    }

    function closeFloatingVideo() {
        if (!floatingVideo) return;
        floatingVideo.hidden = true;
        if (floatingVideoEl) {
            floatingVideoEl.pause();
            floatingVideoEl.currentTime = 0;
        }
        if (floatingVideoIframe) {
            floatingVideoIframe.src = '';
        }
    }

    if (videoLauncher) {
        videoLauncher.addEventListener('click', () => {
            const src = videoLauncher.dataset.videoSrc;
            const embed = videoLauncher.dataset.videoEmbed;
            const title = videoLauncher.dataset.videoTitle || 'Video';
            if (embed) {
                openFloatingVideo(embed, title, true);
            } else if (src) {
                openFloatingVideo(src, title, false);
            }
        });
    }

    if (floatingVideoClose) floatingVideoClose.addEventListener('click', closeFloatingVideo);

    if (floatingVideoMin) {
        floatingVideoMin.addEventListener('click', () => {
            floatingVideo.classList.toggle('floating-video--minimized');
            floatingVideo.classList.remove('floating-video--maximized');
        });
    }
    if (floatingVideoMax) {
        floatingVideoMax.addEventListener('click', () => {
            floatingVideo.classList.toggle('floating-video--maximized');
            floatingVideo.classList.remove('floating-video--minimized');
        });
    }

    /* Drag (arrastrar la ventana flotante) */
    if (floatingVideoHeader && floatingVideo) {
        let dragging = false;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;

        floatingVideoHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.floating-video__btn')) return;
            if (floatingVideo.classList.contains('floating-video--maximized')) return;
            dragging = true;
            const rect = floatingVideo.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            floatingVideo.style.left = startLeft + 'px';
            floatingVideo.style.top = startTop + 'px';
            floatingVideo.style.right = 'auto';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = Math.max(8, Math.min(window.innerWidth - 100, startLeft + dx));
            const newTop = Math.max(8, Math.min(window.innerHeight - 60, startTop + dy));
            floatingVideo.style.left = newLeft + 'px';
            floatingVideo.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
            }
        });
    }

    /* Resize (esquina inferior derecha) */
    if (floatingVideoResize && floatingVideo) {
        let resizing = false;
        let startX = 0, startY = 0, startW = 0, startH = 0;

        floatingVideoResize.addEventListener('mousedown', (e) => {
            if (floatingVideo.classList.contains('floating-video--maximized')) return;
            resizing = true;
            const rect = floatingVideo.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startW = rect.width;
            startH = rect.height;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!resizing) return;
            const newW = Math.max(320, startW + (e.clientX - startX));
            const newH = Math.max(220, startH + (e.clientY - startY));
            floatingVideo.style.width = newW + 'px';
            floatingVideo.style.height = newH + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (resizing) {
                resizing = false;
                document.body.style.userSelect = '';
            }
        });
    }

    /* Cerrar con tecla Escape */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && floatingVideo && !floatingVideo.hidden) {
            closeFloatingVideo();
        }
    });

})();
