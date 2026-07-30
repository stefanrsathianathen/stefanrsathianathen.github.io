// Paper Plane — a tiny flappy-glider over the mountains.
(() => {
    const overlay = document.getElementById('game-overlay');
    const canvas = document.getElementById('game-canvas');
    const openBtn = document.getElementById('play-btn');
    const closeBtn = document.getElementById('game-close');
    const ctx = canvas.getContext('2d');

    // Short stamp labels for every country Stefan has actually visited (see map.js).
    const COUNTRIES = [
        'SINGAPORE', 'AUSTRALIA', 'N. ZEALAND', 'USA', 'ICELAND', 'CANADA', 'HONG KONG', 'GERMANY',
        'UAE', 'HOLLAND', 'TURKEY', 'AZERBAIJAN', 'SPAIN', 'SWITZ.', 'FRANCE',
        'MOROCCO', 'ITALY', 'PORTUGAL', 'JAPAN', 'QATAR', 'IRAN', 'SRI LANKA',
        'MALDIVES', 'MONACO', 'BRAZIL', 'ARGENTINA', 'PERU', 'AUSTRIA', 'UK',
        'UZBEKISTAN', 'KAZAKHSTAN', 'KYRGYZSTAN', 'POLAND', 'CROATIA', 'DENMARK', 'IRELAND',
        'NORWAY', 'JORDAN', 'INDIA', 'NEPAL', 'HUNGARY', 'SERBIA', 'N. MACEDONIA',
        'FIJI', 'TAIWAN', 'KOSOVO', 'BULGARIA', 'LIECHT.', 'MEXICO',
    ];
    const TOTAL = COUNTRIES.length;
    const dark = matchMedia('(prefers-color-scheme: dark)');

    let W, H, dpr, raf = null;
    let state; // 'ready' | 'flying' | 'over'
    let plane, clouds, stamps, ridges, t, dist, collected, pool, best, bestCountries;

    best = +(localStorage.getItem('pp-best') || 0);
    bestCountries = +(localStorage.getItem('pp-best-countries') || 0);

    function resize() {
        dpr = Math.min(devicePixelRatio || 1, 2);
        W = overlay.clientWidth;
        H = overlay.clientHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeRidge(seed, amp, base) {
        const pts = [];
        for (let i = 0; i <= 24; i++) {
            const x = i / 24;
            pts.push(base + amp * (Math.sin(seed * 9 + i * 1.7) * 0.5 + Math.sin(seed * 3 + i * 0.6) * 0.5));
        }
        return pts;
    }

    function reset() {
        state = 'ready';
        plane = { x: W * 0.28, y: H * 0.45, vy: 0 };
        clouds = [];
        stamps = [];
        ridges = [
            { pts: makeRidge(1, H * 0.05, H * 0.72), speed: 0.4 },
            { pts: makeRidge(7, H * 0.08, H * 0.82), speed: 0.7 },
        ];
        t = 0;
        dist = 0;
        collected = [];
        pool = COUNTRIES.slice();
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
    }

    function flap() {
        if (state === 'ready') state = 'flying';
        if (state === 'flying') plane.vy = -6.2;
        else if (state === 'over') reset();
    }

    function spawn() {
        if (t % 95 === 0) {
            const y = H * (0.18 + Math.random() * 0.5);
            clouds.push({ x: W + 80, y, r: 26 + Math.random() * 22 });
        }
        if (t % 160 === 80 && pool.length) {
            const y = H * (0.15 + Math.random() * 0.55);
            stamps.push({ x: W + 60, y, code: pool.pop(), got: false });
        }
    }

    function step() {
        t++;
        const speed = 3 + Math.min(dist / 800, 2.5);
        if (state === 'flying') {
            plane.vy += 0.32;
            plane.y += plane.vy;
            dist += speed * 0.6;
            spawn();

            clouds.forEach(c => c.x -= speed);
            stamps.forEach(s => s.x -= speed);
            clouds = clouds.filter(c => c.x > -120);
            stamps = stamps.filter(s => {
                if (s.x > -80) return true;
                if (!s.got) pool.unshift(s.code); // missed — back into the deck
                return false;
            });

            for (const c of clouds) {
                if (Math.hypot(c.x - plane.x, c.y - plane.y) < c.r + 12) return gameOver();
            }
            for (const s of stamps) {
                if (!s.got && Math.hypot(s.x - plane.x, s.y - plane.y) < 30) {
                    s.got = true;
                    collected.push(s.code);
                    dist += 100;
                }
            }
            if (plane.y > H + 20 || plane.y < -40) return gameOver();
        }
    }

    function gameOver() {
        state = 'over';
        best = Math.max(best, Math.round(dist));
        localStorage.setItem('pp-best', best);
        bestCountries = Math.max(bestCountries, collected.length);
        localStorage.setItem('pp-best-countries', bestCountries);
    }

    function drawPlane() {
        const angle = state === 'flying' ? Math.max(-0.5, Math.min(0.7, plane.vy * 0.07)) : Math.sin(t * 0.05) * 0.08;
        ctx.save();
        ctx.translate(plane.x, plane.y);
        ctx.rotate(angle);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = 'rgba(30,50,80,0.55)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(18, 0); ctx.lineTo(-14, -9); ctx.lineTo(-6, 0); ctx.lineTo(-14, 9); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(18, 0); ctx.lineTo(-6, 0);
        ctx.stroke();
        ctx.restore();
    }

    function draw() {
        const isDark = dark.matches;
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        if (isDark) { sky.addColorStop(0, '#101c2e'); sky.addColorStop(1, '#233b57'); }
        else { sky.addColorStop(0, '#9ec3e6'); sky.addColorStop(1, '#e9f2fa'); }
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // parallax ridgelines
        ridges.forEach((r, i) => {
            const off = (t * r.speed) % (W / 12);
            ctx.fillStyle = isDark
                ? (i === 0 ? 'rgba(150,175,205,0.25)' : 'rgba(200,220,240,0.35)')
                : (i === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(245,250,255,0.9)');
            ctx.beginPath();
            ctx.moveTo(-off, H);
            r.pts.forEach((y, j) => ctx.lineTo(-off + (j / 24) * (W + W / 12), y));
            ctx.lineTo(W + 100, H);
            ctx.closePath();
            ctx.fill();
        });

        // clouds
        ctx.fillStyle = isDark ? 'rgba(190,205,225,0.8)' : 'rgba(255,255,255,0.95)';
        clouds.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x - c.r * 0.5, c.y, c.r * 0.62, 0, 7);
            ctx.arc(c.x, c.y - c.r * 0.3, c.r * 0.72, 0, 7);
            ctx.arc(c.x + c.r * 0.5, c.y, c.r * 0.6, 0, 7);
            ctx.fill();
        });

        // stamps
        stamps.forEach(s => {
            if (s.got) return;
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(-0.15);
            ctx.strokeStyle = '#c2483b';
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 17, 0, 7); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#c2483b';
            ctx.font = 'bold 9px system-ui, sans-serif';
            const w = ctx.measureText(s.code).width;
            if (w > 28) ctx.font = `bold ${Math.max(5.5, 9 * 28 / w)}px system-ui, sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(s.code, 0, 0.5);
            ctx.restore();
        });

        drawPlane();

        // HUD
        ctx.fillStyle = isDark ? '#eef2f7' : '#16202b';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '600 15px system-ui, sans-serif';
        ctx.fillText(`${Math.round(dist)} km`, 20, 18);
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(`countries: ${collected.length}/${TOTAL}`, 20, 40);
        if (collected.length >= TOTAL) {
            ctx.fillText('world complete ✈', 20, 58);
        } else if (collected.length) {
            ctx.fillText(collected.slice(-3).join(' · '), 20, 58);
        }

        ctx.textAlign = 'center';
        if (state === 'ready') {
            ctx.font = '600 18px system-ui, sans-serif';
            ctx.fillText('tap or press space to fly', W / 2, H * 0.62);
            ctx.font = '13px system-ui, sans-serif';
            ctx.fillText('dodge the clouds · collect the stamps', W / 2, H * 0.62 + 28);
        } else if (state === 'over') {
            ctx.font = '700 26px system-ui, sans-serif';
            ctx.fillText(`you flew ${Math.round(dist)} km`, W / 2, H * 0.38);
            ctx.font = '15px system-ui, sans-serif';
            const visited = collected.length
                ? `you visited ${collected.length}/${TOTAL} countries`
                : 'no passport stamps this time';
            ctx.fillText(visited, W / 2, H * 0.38 + 34);
            ctx.fillText(`best: ${best} km · ${bestCountries}/${TOTAL} countries`, W / 2, H * 0.38 + 58);
            ctx.font = '600 14px system-ui, sans-serif';
            ctx.fillText('tap to fly again · esc to land', W / 2, H * 0.38 + 92);
        }
    }

    function loop() {
        step();
        draw();
        raf = requestAnimationFrame(loop);
    }

    function open() {
        overlay.hidden = false;
        resize();
        reset();
        if (!raf) loop();
        closeBtn.focus();
    }

    function close() {
        overlay.hidden = true;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        openBtn.focus();
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    addEventListener('resize', () => { if (!overlay.hidden) { resize(); if (state !== 'flying') reset(); } });
    addEventListener('keydown', e => {
        if (overlay.hidden) return;
        if (e.key === 'Escape') close();
        if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); flap(); }
    });
    canvas.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
})();
