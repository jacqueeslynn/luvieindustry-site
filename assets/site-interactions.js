(() => {
    const studio = document.querySelector('.decision-studio');
    if (!studio) return;

    const tabs = Array.from(studio.querySelectorAll('[data-decision-tab]'));
    const panels = Array.from(studio.querySelectorAll('[data-decision-panel]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rtl = document.documentElement.dir === 'rtl';
    const motion = () => !reducedMotion.matches && typeof window.gsap !== 'undefined';

    function select(tab, focus = false) {
        const key = tab.dataset.decisionTab;
        const panel = panels.find((item) => item.dataset.decisionPanel === key);
        if (!panel) return;

        tabs.forEach((item) => {
            const selected = item === tab;
            item.classList.toggle('is-selected', selected);
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((item) => { item.hidden = item !== panel; });
        if (focus) tab.focus();

        if (motion()) {
            window.gsap.killTweensOf(panel);
            window.gsap.fromTo(panel,
                { autoAlpha: 0, y: 14 },
                { autoAlpha: 1, y: 0, duration: .42, ease: 'power2.out', clearProps: 'all' });
        }
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', (event) => {
            let next = index;
            if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
            else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = tabs.length - 1;
            else return;
            event.preventDefault();
            select(tabs[next], true);
        });
    });

    if (motion() && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer.disconnect();
            window.gsap.fromTo(
                studio.querySelectorAll('.decision-studio__heading, .decision-choice, .decision-studio__results'),
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: .55, stagger: .07, ease: 'power2.out', clearProps: 'all' }
            );
        }, { threshold: .12 });
        observer.observe(studio);
    }
})();
