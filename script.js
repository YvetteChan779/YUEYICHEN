/* ==========================================================
   Yvette Chan · 个人主页交互脚本
   ========================================================== */

(function () {
    'use strict';

    /* ---------- 主题切换（持久化） ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    const savedTheme =
        localStorage.getItem('yvette-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.setAttribute('data-theme', savedTheme);

    themeToggle?.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('yvette-theme', next);
    });

    /* ---------- 滚动时导航栏样式 ---------- */
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 当前章节高亮 ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 120;
        let currentId = 'home';
        sections.forEach((sec) => {
            if (scrollPos >= sec.offsetTop) {
                currentId = sec.id;
            }
        });
        navLinks.forEach((link) => {
            const target = link.getAttribute('href')?.replace('#', '');
            link.classList.toggle('active', target === currentId);
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ---------- 移动端菜单 ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const navLinksWrap = document.querySelector('.nav-links');

    menuToggle?.addEventListener('click', () => {
        navLinksWrap.classList.toggle('mobile-open');
    });
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navLinksWrap.classList.remove('mobile-open');
        });
    });

    /* ---------- 打字机效果 ---------- */
    const phrases = [
        '前端开发者 · Frontend Developer',
        'UI 设计爱好者 · UI Enthusiast',
        '咖啡品鉴师 · Coffee Lover ☕',
        '梦想收藏家 · Dream Collector',
    ];
    const typeEl = document.getElementById('typewriter');
    let pIndex = 0;
    let cIndex = 0;
    let deleting = false;

    const type = () => {
        if (!typeEl) return;
        const current = phrases[pIndex];
        if (!deleting) {
            typeEl.textContent = current.slice(0, ++cIndex);
            if (cIndex === current.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
        } else {
            typeEl.textContent = current.slice(0, --cIndex);
            if (cIndex === 0) {
                deleting = false;
                pIndex = (pIndex + 1) % phrases.length;
            }
        }
        setTimeout(type, deleting ? 40 : 90);
    };
    type();

    /* ---------- 数字滚动 ---------- */
    const animateCount = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.getAttribute('suffix') || '';
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    /* ---------- IntersectionObserver: 滚动揭示 + 触发动画 ---------- */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('visible');

                el.querySelectorAll('.skill-fill').forEach((bar) => {
                    bar.style.width = bar.dataset.width + '%';
                });

                el.querySelectorAll('.stat-num').forEach((num) => {
                    if (!num.dataset.done) {
                        num.dataset.done = 'true';
                        animateCount(num);
                    }
                });

                observer.unobserve(el);
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    document.querySelectorAll('.hero .stat-num').forEach((num) => {
        num.dataset.done = 'true';
        animateCount(num);
    });

    /* ---------- 联系表单 ---------- */
    const form = document.getElementById('contactForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '✓ 消息已发送！';
        btn.style.background = 'linear-gradient(135deg, #4ade80, #22d3ee)';
        form.reset();
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
        }, 2400);
    });

    /* ---------- 鼠标视差（仅桌面） ---------- */
    if (window.matchMedia('(pointer: fine)').matches) {
        const blobs = document.querySelectorAll('.blob');
        const tags = document.querySelectorAll('.floating-tag');

        document.addEventListener(
            'mousemove',
            (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                blobs.forEach((b, i) => {
                    const factor = (i + 1) * 14;
                    b.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                });
                tags.forEach((t, i) => {
                    const factor = (i + 1) * 6;
                    t.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                });
            },
            { passive: true }
        );
    }

    /* ---------- 自动更新年份 ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 锚点平滑滚动（兜底） ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id && id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    /* ---------- 控制台彩蛋 ---------- */
    console.log(
        '%c👋 Hi there!',
        'font-size:24px;font-weight:bold;background:linear-gradient(135deg,#c084fc,#f472b6);-webkit-background-clip:text;color:transparent;'
    );
    console.log(
        '%c欢迎来到 Yvette 的小宇宙 ✨\n如果你也喜欢代码与设计，记得来打个招呼～',
        'font-size:13px;color:#c084fc;'
    );
})();
