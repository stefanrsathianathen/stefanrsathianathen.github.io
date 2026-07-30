// Passport — travel photos as a flippable passport book.
(() => {
    const SPREADS = [
        { country: 'Peru', place: 'Machu Picchu', date: 'JUN 2024', ink: '#7a2f2f',
          photos: [['photos/machu-picchu.webp', 'Machu Picchu']], extra: ['photos/llama.webp', 'A llama in the Andes'] },
        { country: 'Denmark', place: 'Copenhagen', date: 'FEB 2025', ink: '#1f4d7a',
          photos: [['photos/nyhavn.webp', 'Nyhavn canal']], extra: ['photos/nyhavn-bikes.webp', 'Cyclists in Copenhagen'] },
        { country: 'Netherlands', place: 'Keukenhof', date: 'MAR 2025', ink: '#a3542c',
          photos: [['photos/tulips.webp', 'Red tulips']] },
        { country: 'Jordan', place: 'Petra · Wadi Rum', date: 'MAR 2025', ink: '#31606b',
          photos: [['photos/petra.webp', 'The Treasury, Petra'], ['photos/camel.webp', 'Camel in Wadi Rum']],
          extra: ['photos/petra-night.webp', 'Petra by candlelight'] },
        { country: 'Canada', place: 'Maligne Lake', date: 'JUN 2025', ink: '#4a3b78',
          photos: [['photos/maligne-lake.webp', 'Maligne Lake boathouse']] },
        { country: 'Taiwan', place: 'Night market', date: 'NOV 2025', ink: '#8a2f52',
          photos: [['photos/wok-fire.webp', 'Street cook, flaming wok']] },
        { country: 'USA', place: 'Sequoia NP', date: 'DEC 2025', ink: '#2f6b3f',
          photos: [['photos/sequoias.webp', 'Giant sequoias']] },
    ];

    const book = document.getElementById('passport-book');

    function el(tag, cls, html) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html !== undefined) n.innerHTML = html;
        return n;
    }

    function photoEl(src, alt, cls) {
        const w = el('figure', 'pp-print ' + (cls || ''));
        const img = new Image();
        img.src = src;
        img.alt = alt;
        w.appendChild(img);
        return w;
    }

    function photosPage(s) {
        const page = el('div', 'pp-page pp-photos');
        s.photos.forEach(([src, alt], i) => page.appendChild(photoEl(src, alt, 'pp-print-' + i)));
        page.appendChild(el('p', 'pp-caption', s.place));
        return page;
    }

    function stampPage(s) {
        const page = el('div', 'pp-page pp-stamppage');
        const stamp = el('div', 'pp-stamp');
        stamp.style.color = s.ink;
        stamp.append(
            el('span', 'pp-stamp-top', 'ADMITTED'),
            el('span', 'pp-stamp-country', s.country.toUpperCase()),
            el('span', 'pp-stamp-date', s.date),
        );
        page.appendChild(stamp);
        if (s.extra) page.appendChild(photoEl(s.extra[0], s.extra[1], 'pp-extra'));
        return page;
    }

    function identityPage() {
        const page = el('div', 'pp-page pp-id');
        page.append(
            el('p', 'pp-id-label', 'TRAVEL LOG'),
            photoEl('pfp.jpeg', 'Stefan Sathianathen', 'pp-id-photo'),
            el('p', 'pp-id-name', 'SATHIANATHEN, STEFAN'),
            el('p', 'pp-id-row', 'Occupation — <strong>builder @ Infinite</strong>'),
            el('p', 'pp-id-row', 'Distinguishing marks — <strong>avid traveler</strong>'),
        );
        return page;
    }

    function introPage() {
        const page = el('div', 'pp-page pp-intro');
        page.append(
            el('p', 'pp-intro-title', 'The bearer has wandered'),
            el('p', 'pp-intro-sub', SPREADS.length + ' countries · ' + SPREADS.length + ' stamps'),
            el('p', 'pp-intro-hint', 'flip →'),
        );
        return page;
    }

    function endPage() {
        const page = el('div', 'pp-page pp-end');
        page.append(el('p', 'pp-intro-title', 'pages full'), el('p', 'pp-intro-hint', 'the journey continues…'));
        return page;
    }

    function igPage() {
        const page = el('div', 'pp-page pp-ig');
        const a = el('a', 'pp-ig-link');
        a.href = 'https://www.instagram.com/stefan_r_s/';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069m0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881"/></svg>'
            + '<span>more stamps on<br><strong>@stefan_r_s</strong></span>';
        page.appendChild(a);
        return page;
    }

    // Build book: base pages + leaves. State k shows spread k (0 = id/intro, 1..N = destinations, N+1 = end/ig).
    const N = SPREADS.length;
    const baseLeft = el('div', 'pp-base pp-base-left');
    baseLeft.appendChild(identityPage());
    const baseRight = el('div', 'pp-base pp-base-right');
    baseRight.appendChild(igPage());
    book.append(baseLeft, baseRight);

    const leaves = [];
    for (let k = 0; k <= N; k++) {
        const leaf = el('div', 'pp-leaf');
        const front = el('div', 'pp-face pp-front');
        front.appendChild(k === 0 ? introPage() : stampPage(SPREADS[k - 1]));
        const back = el('div', 'pp-face pp-back');
        back.appendChild(k === N ? endPage() : photosPage(SPREADS[k]));
        leaf.append(front, back);
        book.appendChild(leaf);
        leaves.push(leaf);
    }

    let flipped = 0; // number of leaves turned
    function setZ() {
        leaves.forEach((leaf, k) => {
            leaf.style.zIndex = leaf.classList.contains('flipped') ? k + 1 : leaves.length + 1 - k;
        });
    }
    function next() { if (flipped <= N) { leaves[flipped]?.classList.add('flipped'); flipped = Math.min(flipped + 1, N + 1); setTimeout(setZ, 300); } }
    function prev() { if (flipped > 0) { flipped--; leaves[flipped].classList.remove('flipped'); setTimeout(setZ, 300); } }
    setZ();

    book.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        const r = book.getBoundingClientRect();
        (e.clientX - r.left < r.width / 2) ? prev() : next();
    });

    addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });
})();
