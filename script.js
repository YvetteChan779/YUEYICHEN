/* ==========================================================
   Academic Homepage — Minimal JS
   ========================================================== */

(function () {
    'use strict';

    /* Theme toggle */
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    const saved = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', saved);

    toggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* Active nav highlight */
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .profile-layout[id]');

    const highlight = () => {
        const y = window.scrollY + 100;
        let current = '';
        sections.forEach(s => {
            if (y >= s.offsetTop) current = s.id;
        });
        links.forEach(l => {
            const href = l.getAttribute('href')?.replace('#', '');
            l.classList.toggle('active', href === current);
        });
    };
    window.addEventListener('scroll', highlight, { passive: true });

    /* Auto year */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
