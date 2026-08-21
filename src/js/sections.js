/* ================= SECTIONS & INTERACTIONS ================= */
(function () {
  "use strict";
  const { $, $$, esc, Cfg, photoURL, imgTag, toast, sleep, rand, revealObserver } = window.Core;
  const SceneX = window.SceneX, AudioX = window.AudioX, FX = window.FX;

  /* ------------------------------------------------------------
     SECTION BUILDERS
  ------------------------------------------------------------ */
  const SECTIONS = [];

  /* ---------- 1. HERO: from Suraj + Happy Birthday Seema ---------- */
  SECTIONS.push({
    id: "sec-hero",
    render() {
      const s = Cfg.suraj, b = Cfg.birthday;
      const rel = s.relationship ? `<div class="rel-pill">${esc(s.relationship)}</div>` : "";
      return `
      <section id="sec-hero" class="sec sec-hero">
        <div class="hero-inner">
          <div class="kicker reveal">FROM ${esc(s.name).toUpperCase()} ❤️</div>

          <div class="hero-card glass reveal">
            <div class="hero-photo tilt" data-tilt="12">
              <div class="polaroid-frame">
                ${imgTag(s.photo, "photo-img", s.name)}
                <div class="polaroid-cap">${esc(s.name)}</div>
              </div>
            </div>
            <div class="hero-info">
              <h2 class="name-serif">${esc(s.name)}</h2>
              ${rel}
              <p class="hero-intro">“${esc(s.intro)}”</p>
              <div class="hero-tag">Suraj × Seema</div>
            </div>
          </div>

          <div class="hero-divider reveal"><span>✦</span></div>

          <div class="hero-birthday reveal">
            <div class="cake-emoji">🎂</div>
            <h1 class="giant">HAPPY BIRTHDAY<br><span class="grad-text">${esc(b.name).toUpperCase()}</span></h1>
            <div class="age-line"><span class="age-num">${esc(b.age)}</span> YEARS OF BEAUTIFUL MEMORIES</div>
            <div class="date-line">${esc(b.fullBirthday)}</div>
          </div>
          <div class="scroll-hint reveal">scroll to begin the journey <span class="arrow">↓</span></div>
        </div>
      </section>`;
    }
  });

  /* ---------- 2. OUR STORY ---------- */
  SECTIONS.push({
    id: "sec-story",
    render() {
      const st = Cfg.story, s = Cfg.suraj, b = Cfg.birthday;
      const relLine = s.relationship
        ? `<div class="story-rel reveal"><span>Relationship:</span> ${esc(s.relationship)}</div>` : "";
      return `
      <section id="sec-story" class="sec">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER ONE</div>
          <h2 class="sec-title">OUR STORY <span class="heart-emoji">❤️</span></h2>
          <div class="story-names"><span class="grad-text">${esc(s.name)}</span> <span class="plus">+</span> <span class="grad-text">${esc(b.name)}</span></div>
          ${relLine}
        </div>
        <div class="story-body">
          <div class="story-block reveal">
            <div class="story-photo polaroid-frame tilt" data-tilt="8">${imgTag("together", "photo-img", "suraj & seema")}<div class="polaroid-cap">the beginning</div></div>
            <div class="story-copy">
              <h3>The Beginning</h3>
              <p>“Everything started with…”</p>
              <p class="story-text">${esc(st.metHow)}</p>
              <p class="story-meta"><span>⏳ When:</span> ${esc(st.metWhen)}</p>
              <p class="story-text">${esc(st.firstMemory)}</p>
            </div>
          </div>
          <div class="story-block flip reveal">
            <div class="story-copy">
              <h3>The Memories</h3>
              <p>“Some moments became memories without us even realizing it.”</p>
              <p class="story-text"><span>💛 Favorite:</span> ${esc(st.favoriteMoment)}</p>
              <p class="story-text"><span>😂 Funny:</span> ${esc(st.funnyMemory)}</p>
              <p class="story-text"><span>✨ Special:</span> ${esc(st.specialMoment)}</p>
              <p class="story-text">${esc(st.together)}</p>
            </div>
            <div class="story-photo polaroid-frame tilt" data-tilt="8">${imgTag("memory1", "photo-img", "memories")}<div class="polaroid-cap">little moments, big memories</div></div>
          </div>
          <div class="story-block reveal">
            <div class="story-photo polaroid-frame tilt" data-tilt="8">${imgTag("together2", "photo-img", "today")}<div class="polaroid-cap">today & every day</div></div>
            <div class="story-copy">
              <h3>Today</h3>
              <p>“And now there are so many stories to remember.”</p>
              <p class="story-text">${esc(st.meaning)}</p>
            </div>
          </div>
        </div>
      </section>`;
    }
  });

  /* ---------- 3. TIMELINE ---------- */
  SECTIONS.push({
    id: "sec-timeline",
    render() {
      const items = (Cfg.memories || []).map((m, i) => `
        <div class="tl-item ${i % 2 ? "tl-left" : "tl-right"} reveal">
          <div class="tl-date">${esc(m.date)}</div>
          <div class="tl-card glass tilt" data-tilt="10">
            ${m.photo ? `<div class="tl-photo">${imgTag(m.photo, "", m.title)}</div>` : ""}
            <h3>${esc(m.title)}</h3>
            <p class="tl-desc">${esc(m.desc)}</p>
            ${m.location ? `<div class="tl-loc">📍 ${esc(m.location)}</div>` : ""}
          </div>
        </div>`).join("");
      return `
      <section id="sec-timeline" class="sec">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER TWO</div>
          <h2 class="sec-title">MOMENTS THAT MATTER</h2>
          <p class="sec-sub">our little timeline of us</p>
        </div>
        <div class="timeline">${items}</div>
      </section>`;
    }
  });

  /* ---------- 4. GALLERY ---------- */
  SECTIONS.push({
    id: "sec-gallery",
    render() {
      const all = [];
      Object.keys(Cfg.photos).forEach((cat) => {
        (Cfg.photos[cat] || []).forEach((key) => {
          const note = Cfg.notes[key] || Cfg.notes[cat] || {};
          all.push({ key, url: photoURL(key), caption: note.caption || "Suraj × Seema", date: note.date || "", memory: note.memory || "" });
        });
      });
      window.__GALLERY = all;
      const cards = all.map((p, i) => `
        <div class="gal-item reveal tilt" data-tilt="9" data-i="${i}">
          <div class="polaroid-frame">
            ${p.url ? `<img class="photo-img" src="${p.url}" alt="memory" loading="lazy" draggable="false">` : `<div class="ph-empty"></div>`}
            <div class="polaroid-cap">${esc(p.caption)}</div>
          </div>
        </div>`).join("");
      return `
      <section id="sec-gallery" class="sec">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER THREE</div>
          <h2 class="sec-title">US — IN MEMORIES <span class="cam">📸</span></h2>
          <p class="sec-sub"><span class="grad-text">Suraj × Seema</span> — tap any moment to relive it</p>
        </div>
        <div class="gallery">${cards}</div>
      </section>`;
    },
    mount() {
      const g = $("#sec-gallery .gallery");
      if (!g) return;
      g.addEventListener("click", (e) => {
        const item = e.target.closest(".gal-item");
        if (!item) return;
        openLightbox(parseInt(item.dataset.i, 10));
      });
    }
  });

  /* ---------- 5. WORDS FROM SURAJ ---------- */
  SECTIONS.push({
    id: "sec-words",
    render() {
      const s = Cfg.suraj;
      const paras = (Cfg.words || []).map((p) => `<p class="word-line">${esc(p)}</p>`).join("");
      return `
      <section id="sec-words" class="sec">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER FOUR</div>
          <h2 class="sec-title">A FEW WORDS FROM <span class="grad-text">${esc(s.name).toUpperCase()}</span></h2>
        </div>
        <div class="words-wrap">
          <div class="words-photo polaroid-frame tilt reveal" data-tilt="10">
            ${imgTag(s.photo, "photo-img", s.name)}
            <div class="polaroid-cap">with love, ${esc(s.name)}</div>
          </div>
          <div class="words-card reveal">
            <div class="paper">${paras}</div>
          </div>
        </div>
      </section>`;
    }
  });

  /* ---------- 6. PRIVATE MEMORIES ---------- */
  SECTIONS.push({
    id: "sec-private",
    render() {
      const cards = (Cfg.private || []).map((p) => `
        <div class="priv-item reveal">
          <div class="priv-card glass tilt" data-tilt="10">
            <div class="priv-photo">${imgTag(p.photo, "", p.title)}</div>
            <div class="priv-body">
              <h3>${esc(p.title)}</h3>
              <p>“${esc(p.caption)}”</p>
            </div>
          </div>
        </div>`).join("");
      return `
      <section id="sec-private" class="sec">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER FIVE</div>
          <h2 class="sec-title">MEMORIES ONLY WE UNDERSTAND <span class="heart-emoji">🤍</span></h2>
          <p class="sec-sub">the ones nobody else would get</p>
        </div>
        <div class="priv-grid">${cards}</div>
      </section>`;
    }
  });

  /* ---------- 7. LETTER ---------- */
  SECTIONS.push({
    id: "sec-letter",
    render() {
      return `
      <section id="sec-letter" class="sec sec-letter">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER SIX</div>
          <h2 class="sec-title">A LETTER FOR <span class="grad-text">${esc(Cfg.birthday.name).toUpperCase()}</span></h2>
        </div>
        <div class="letter-stage reveal" id="letter-stage">
          <div class="env-scene" id="env-scene">
            <div class="env-back"></div>
            <div class="env-letter" id="env-letter">
              <div class="letter-paper">
                <div class="letter-lines" id="letter-lines"></div>
                <div class="letter-sign">With love and best wishes,<br><span class="sign-name">${esc(Cfg.suraj.name)} ❤️</span></div>
              </div>
            </div>
            <div class="env-body"></div>
            <div class="env-flap"></div>
            <div class="env-seal">♥</div>
          </div>
          <button id="open-letter-btn" class="btn-gold">OPEN LETTER 💌</button>
        </div>
      </section>`;
    },
    mount() {
      const btn = $("#open-letter-btn");
      const scene = $("#env-scene");
      const letter = $("#env-letter");
      const linesBox = $("#letter-lines");
      if (!btn || !scene) return;
      let opened = false;
      btn.addEventListener("click", async () => {
        if (opened) return;
        opened = true;
        AudioX && AudioX.pop();
        btn.classList.add("hidden");
        scene.classList.add("open");
        await sleep(900);
        letter.classList.add("out");
        $("#sec-letter").classList.add("letter-open");
        // fill lines
        linesBox.innerHTML = (Cfg.letter || []).map((p) => `<p class="l-line">${esc(p)}</p>`).join("");
        $$("#letter-lines .l-line").forEach((el, i) => setTimeout(() => el.classList.add("show"), 260 + i * 420));
        setTimeout(() => { FX && FX.heartRise(10); }, 800);
      });
    }
  });

  /* ---------- 8. CAKE ---------- */
  SECTIONS.push({
    id: "sec-cake",
    render() {
      const b = Cfg.birthday;
      return `
      <section id="sec-cake" class="sec sec-cake" data-focus="cake">
        <div class="cake-ui">
          <div class="kicker reveal">CHAPTER SEVEN — THE MOMENT</div>
          <h2 class="cake-name grad-text reveal">${esc(b.name).toUpperCase()}</h2>
          <div class="cake-age reveal"><span>${esc(b.age)}</span></div>
          <div class="cake-sub reveal">${esc(b.age)} candles are waiting for you ✨</div>
          <div id="wish-ui">
            <button id="make-wish-btn" class="btn-gold reveal">MAKE A WISH ✨</button>
            <div id="wish-state" class="wish-state">
              <p class="wish-line">Make your wish, ${esc(b.name)}...</p>
              <button id="blow-btn" class="btn-soft hidden">💨 BLOW OUT THE CANDLES</button>
              <p id="wish-done" class="wish-done hidden">MAY YOUR WISH COME TRUE <span class="heart-emoji">❤️</span></p>
            </div>
          </div>
          <button id="relight-btn" class="link-btn hidden">🕯️ light the candles again</button>
        </div>
      </section>`;
    },
    mount() {
      const makeBtn = $("#make-wish-btn");
      const blowBtn = $("#blow-btn");
      const state = $("#wish-state");
      const done = $("#wish-done");
      const relight = $("#relight-btn");
      if (!makeBtn) return;
      makeBtn.addEventListener("click", () => {
        makeBtn.classList.add("hidden");
        state.classList.add("show");
        SceneX && SceneX.wishMode();
        AudioX && AudioX.softBell();
        AudioX && AudioX.duck();
        setTimeout(() => {
          blowBtn.classList.remove("hidden");
          FX && FX.heartRise(8);
        }, 3000);
      });
      blowBtn.addEventListener("click", () => {
        blowBtn.classList.add("hidden");
        const line = $("#wish-state .wish-line");
        if (line) line.textContent = "3... 2... 1... 💨";
        SceneX && SceneX.blowCandles(() => {
          done.classList.remove("hidden");
          state.querySelector(".wish-line") && state.querySelector(".wish-line").classList.add("hidden");
          relight.classList.remove("hidden");
          FX && FX.confettiBurst(120);
          FX && FX.heartRise(20);
          SceneX && SceneX.fireworks(7, 520);
          AudioX && AudioX.chime();
          setTimeout(() => AudioX && AudioX.unduck(), 2500);
        });
      });
      relight.addEventListener("click", () => {
        SceneX && SceneX.relight();
        relight.classList.add("hidden");
        done.classList.add("hidden");
        makeBtn.classList.remove("hidden");
        state.classList.remove("show");
      });
    }
  });

  /* ---------- 9. FINAL GIFT ---------- */
  SECTIONS.push({
    id: "sec-gift2",
    render() {
      return `
      <section id="sec-gift2" class="sec" data-focus="gift2">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER EIGHT</div>
          <h2 class="sec-title">ONE LAST SURPRISE FROM <span class="grad-text">${esc(Cfg.suraj.name).toUpperCase()}</span> <span class="gift-emoji">🎁</span></h2>
          <p class="sec-sub">Suraj saved something for the very end...</p>
        </div>
        <button id="open-gift2-btn" class="btn-gold reveal">OPEN THE GIFT 🎁</button>
        <div id="reveal-overlay" class="reveal-overlay">
          <div class="reveal-card glass">
            <button id="reveal-close" class="close-x">✕</button>
            <div id="reveal-content"></div>
          </div>
        </div>
      </section>`;
    },
    mount() {
      const btn = $("#open-gift2-btn");
      if (!btn) return;
      btn.addEventListener("click", () => {
        btn.classList.add("hidden");
        SceneX && SceneX.showGift2();
        setTimeout(() => {
          SceneX && SceneX.openGift2(() => {
            setTimeout(() => showReveal(), 500);
          });
        }, 400);
      });
    }
  });

  /* ---------- 10. VIDEO ---------- */
  SECTIONS.push({
    id: "sec-video",
    render() {
      const v = Cfg.video || {};
      const thumb = v.thumb ? photoURL(v.thumb) : "";
      const hasSrc = !!(v.url || (v.file && v.file.indexOf("data:") === 0));
      return `
      <section id="sec-video" class="sec">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER NINE</div>
          <h2 class="sec-title">A LITTLE SOMETHING FROM <span class="grad-text">${esc(Cfg.suraj.name).toUpperCase()}</span> <span class="cam">🎬</span></h2>
        </div>
        <div class="video-stage reveal">
          <div id="video-shell" class="video-shell ${hasSrc ? "" : "empty"}">
            ${hasSrc
              ? `<video id="bday-video" src="${esc(v.url || v.file)}" preload="metadata" playsinline></video>`
              : `<div class="video-placeholder">
                   ${thumb ? `<img src="${thumb}" alt="video thumbnail">` : `<div class="vp-art">🎥</div>`}
                   <div class="vp-note">${esc(v.note || "Suraj's message will appear here")}</div>
                 </div>`}
            <div class="video-controls" id="video-controls">
              <button class="vc-btn" id="vc-play">▶</button>
              <div class="vc-progress" id="vc-progress"><div class="vc-fill" id="vc-fill"></div><div class="vc-buf" id="vc-buf"></div></div>
              <span class="vc-time" id="vc-time">0:00 / 0:00</span>
              <button class="vc-btn" id="vc-mute">🔊</button>
              <button class="vc-btn" id="vc-full">⛶</button>
            </div>
            <div class="vc-bigplay" id="vc-bigplay">▶</div>
          </div>
        </div>
      </section>`;
    },
    mount() {
      bindVideo();
    }
  });

  /* ---------- 11. SLIDESHOW ---------- */
  SECTIONS.push({
    id: "sec-slideshow",
    render() {
      const all = [];
      Object.keys(Cfg.photos).forEach((cat) => {
        (Cfg.photos[cat] || []).forEach((key) => {
          const note = Cfg.notes[key] || {};
          all.push({ key, url: photoURL(key), caption: note.caption || "Suraj × Seema" });
        });
      });
      window.__SLIDES = all;
      const slides = all.map((s, i) => `
        <div class="slide ${i === 0 ? "active" : ""}" data-i="${i}">
          ${s.url ? `<img class="slide-img" src="${s.url}" alt="memory" draggable="false">` : ""}
          <div class="slide-cap">${esc(s.caption)}</div>
        </div>`).join("");
      const dots = all.map((s, i) => `<span class="dot ${i === 0 ? "on" : ""}" data-i="${i}"></span>`).join("");
      return `
      <section id="sec-slideshow" class="sec">
        <div class="sec-head reveal">
          <div class="kicker">CHAPTER TEN</div>
          <h2 class="sec-title">OUR MEMORIES IN MOTION <span class="cam">🎞️</span></h2>
          <p class="sec-sub">a little film of us — with music</p>
        </div>
        <div class="slideshow-stage reveal" id="slideshow-stage">
          <div class="slides">${slides}</div>
          <div class="slide-dots">${dots}</div>
          <button class="slide-prev" id="slide-prev">‹</button>
          <button class="slide-next" id="slide-next">›</button>
        </div>
      </section>`;
    },
    mount() {
      bindSlideshow();
    }
  });

  /* ---------- 12. FINALE ---------- */
  SECTIONS.push({
    id: "sec-final",
    render() {
      const b = Cfg.birthday, s = Cfg.suraj;
      return `
      <section id="sec-final" class="sec sec-final" data-focus="final">
        <div class="balloons" id="balloons"></div>
        <div class="final-inner">
          <div class="kicker reveal">THE FINAL ACT</div>
          <h2 class="final-h2 reveal">HAPPY 21<sup>ST</sup> BIRTHDAY</h2>
          <h1 class="giant final-name reveal"><span class="grad-text">${esc(b.name).toUpperCase()} <span class="heart-emoji">❤️</span></span></h1>
          <div class="final-from reveal">FROM ${esc(s.name).toUpperCase()}</div>
          <div class="final-date reveal">${esc(b.fullBirthday)}</div>
        </div>
      </section>`;
    },
    mount() {
      makeBalloons($("#balloons"));
    }
  });

  /* ---------- 13. END ---------- */
  SECTIONS.push({
    id: "sec-end",
    render() {
      const b = Cfg.birthday, s = Cfg.suraj;
      return `
      <section id="sec-end" class="sec sec-end">
        <div class="end-inner">
          <div class="end-photo polaroid-frame tilt reveal" data-tilt="8">
            ${imgTag("together2", "photo-img", "seema and suraj")}
            <div class="polaroid-cap">${esc(s.name)} × ${esc(b.name)}</div>
          </div>
          <div class="end-quote reveal">“${esc(Cfg.finalQuote)}”</div>
          <h2 class="end-happy reveal">Happy Birthday, <span class="grad-text">${esc(b.name)}</span> <span class="heart-emoji">❤️</span></h2>
          <div class="end-date reveal">${esc(b.fullBirthday)}</div>
          <div class="end-from reveal">With best wishes from <b>${esc(s.name)}</b></div>
          <p class="end-closing reveal">${esc(Cfg.closing)}</p>
          <div class="end-sig reveal">— ${esc(s.name)} ❤️</div>
        </div>
      </section>`;
    }
  });

  /* ------------------------------------------------------------
     RENDER ALL
  ------------------------------------------------------------ */
  function renderAll() {
    const app = $("#app");
    if (!app) return;
    app.innerHTML = SECTIONS.map((s) => s.render()).join("");
    SECTIONS.forEach((s) => { if (s.mount) s.mount($("#" + s.id)); });
    revealObserver.watch();
    bindSectionFocus();
    bindTilt();
    bindParallax();
    initLightbox();
  }

  /* ------------------------------------------------------------
     SECTION FOCUS → Scene camera
  ------------------------------------------------------------ */
  function bindSectionFocus() {
    const map = { "cake": "cake", "gift2": "gift2", "final": "final" };
    if (!("IntersectionObserver" in window)) return;
    let curFocus = "intro";
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const f = map[en.target.dataset.focus];
        if (en.isIntersecting) {
          if (f) {
            curFocus = f;
            if (f === "cake") SceneX.showCake();
            if (f === "gift2") SceneX.showGift2();
            if (f === "final") {
              SceneX.focus("final");
              if (!window.__finalFired) {
                window.__finalFired = true;
                setTimeout(() => { SceneX.fireworks(9, 500); FX.confettiRain(7); FX.heartRise(26); AudioX.chime(); }, 600);
              }
            }
          } else {
            curFocus = "ambient";
            SceneX.focus("ambient");
          }
        } else if (curFocus === f) {
          curFocus = "ambient";
          SceneX.focus("ambient");
        }
      });
    }, { threshold: 0.35 });
    $$("[data-focus]").forEach((el) => obs.observe(el));
  }

  /* ------------------------------------------------------------
     TILT + PARALLAX (pointer-driven 3D)
  ------------------------------------------------------------ */
  function bindTilt() {
    $$(".tilt").forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 8;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(6px)`;
        el.classList.add("tilted");
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
        el.classList.remove("tilted");
      });
    });
  }

  function bindParallax() {
    const els = $$("[data-parallax]");
    if (!els.length) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        const speed = parseFloat(el.dataset.parallax) || 0.08;
        el.style.transform = `translateY(${(-center * speed).toFixed(1)}px)`;
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------
     LIGHTBOX
  ------------------------------------------------------------ */
  let lightbox = null;
  function initLightbox() {
    if (lightbox) lightbox.remove();
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-card">
        <button class="lb-close">✕</button>
        <button class="lb-nav lb-prev">‹</button>
        <button class="lb-nav lb-next">›</button>
        <div class="lb-img-wrap"><img class="lb-img" alt="memory"></div>
        <div class="lb-info">
          <div class="lb-caption"></div>
          ${Cfg.birthday ? `<div class="lb-label">Suraj × Seema</div>` : ""}
          <div class="lb-date"></div>
          <div class="lb-memory"></div>
        </div>
      </div>`;
    document.body.appendChild(lightbox);
    let idx = 0;
    const gallery = () => window.__GALLERY || [];
    const show = (i) => {
      const g = gallery();
      if (!g.length) return;
      idx = (i + g.length) % g.length;
      const p = g[idx];
      const img = $(".lb-img", lightbox);
      img.src = p.url || "";
      $(".lb-caption", lightbox).textContent = p.caption || "";
      $(".lb-date", lightbox).textContent = p.date ? "📅 " + p.date : "";
      $(".lb-memory", lightbox).textContent = p.memory ? "💭 " + p.memory : "";
      lightbox.classList.add("show");
    };
    $(".lb-close", lightbox).addEventListener("click", () => lightbox.classList.remove("show"));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target.classList.contains("lb-backdrop")) lightbox.classList.remove("show"); });
    $(".lb-next", lightbox).addEventListener("click", () => show(idx + 1));
    $(".lb-prev", lightbox).addEventListener("click", () => show(idx - 1));
    // swipe
    let sx = null, sy = null;
    lightbox.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) show(idx + 1); else show(idx - 1); }
      sx = sy = null;
    }, { passive: true });
    window.__showLightbox = show;
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("show")) return;
      if (e.key === "Escape") lightbox.classList.remove("show");
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }
  function openLightbox(i) { if (window.__showLightbox) window.__showLightbox(i); }

  /* ------------------------------------------------------------
     REVEAL MODAL (gift 2 content)
  ------------------------------------------------------------ */
  function showReveal() {
    const ov = $("#reveal-overlay");
    if (!ov) return;
    const g = Cfg.gift || {};
    const box = $("#reveal-content");
    if (g.type === "message") {
      box.innerHTML = `<div class="rv-message"><div class="rv-emoji">💌</div><p>${esc(g.message)}</p><div class="rv-sig">— ${esc(Cfg.suraj.name)} ❤️</div></div>`;
    } else if (g.type === "video") {
      box.innerHTML = `<video class="rv-video" src="${esc(g.videoUrl)}" controls playsinline></video>`;
    } else {
      box.innerHTML = `${g.photo ? `<img class="rv-photo" src="${photoURL(g.photo)}" alt="surprise">` : ""}<div class="rv-message"><p>${esc(g.message || "")}</p><div class="rv-sig">— ${esc(Cfg.suraj.name)} ❤️</div></div>`;
    }
    ov.classList.add("show");
    FX && FX.confettiBurst(80);
    FX && FX.heartRise(16);
    AudioX && AudioX.chime();
    const close = $("#reveal-close");
    if (close) close.onclick = () => ov.classList.remove("show");
    ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.remove("show"); });
  }

  /* ------------------------------------------------------------
     VIDEO PLAYER
  ------------------------------------------------------------ */
  function bindVideo() {
    const vid = $("#bday-video");
    const shell = $("#video-shell");
    if (!vid || !shell) return;
    const play = $("#vc-play"), prog = $("#vc-progress"), fill = $("#vc-fill"),
      buf = $("#vc-buf"), time = $("#vc-time"), mute = $("#vc-mute"), full = $("#vc-full"), big = $("#vc-bigplay");
    const fmt = (s) => { s = Math.floor(s || 0); const m = Math.floor(s / 60), ss = s % 60; return m + ":" + (ss < 10 ? "0" : "") + ss; };
    const toggle = () => { if (vid.paused) { vid.play(); } else { vid.pause(); } };
    big.addEventListener("click", toggle);
    play.addEventListener("click", () => { play.textContent = vid.paused ? "⏸" : "▶"; toggle(); });
    vid.addEventListener("play", () => { play.textContent = "⏸"; big.classList.add("hidden"); });
    vid.addEventListener("pause", () => { play.textContent = "▶"; if (vid.currentTime === 0 || vid.ended) big.classList.remove("hidden"); });
    vid.addEventListener("timeupdate", () => {
      if (vid.duration) fill.style.width = (vid.currentTime / vid.duration * 100) + "%";
      time.textContent = fmt(vid.currentTime) + " / " + fmt(vid.duration);
    });
    vid.addEventListener("progress", () => {
      if (vid.buffered.length && vid.duration) buf.style.width = (vid.buffered.end(vid.buffered.length - 1) / vid.duration * 100) + "%";
    });
    prog.addEventListener("click", (e) => {
      const r = prog.getBoundingClientRect();
      vid.currentTime = ((e.clientX - r.left) / r.width) * (vid.duration || 0);
    });
    mute.addEventListener("click", () => { vid.muted = !vid.muted; mute.textContent = vid.muted ? "🔇" : "🔊"; });
    full.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (shell.requestFullscreen) shell.requestFullscreen();
    });
    if (!vid.getAttribute("src")) { shell.classList.add("empty"); }
  }

  /* ------------------------------------------------------------
     SLIDESHOW
  ------------------------------------------------------------ */
  let slideTimer = null;
  function bindSlideshow() {
    const stage = $("#slideshow-stage");
    const slides = $$(".slide", stage);
    if (!stage || !slides.length) return;
    let cur = 0;
    const go = (i) => {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === cur));
      $$(".dot", stage).forEach((d, k) => d.classList.toggle("on", k === cur));
    };
    const start = () => { stop(); slideTimer = setInterval(() => go(cur + 1), 4400); };
    const stop = () => { clearInterval(slideTimer); };
    $("#slide-next").addEventListener("click", () => { go(cur + 1); start(); });
    $("#slide-prev").addEventListener("click", () => { go(cur - 1); start(); });
    stage.addEventListener("pointerenter", stop);
    stage.addEventListener("pointerleave", start);
    // swipe
    let sx = null;
    stage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { go(dx < 0 ? cur + 1 : cur - 1); start(); }
      sx = null;
    }, { passive: true });
    $$(".dot", stage).forEach((d) => d.addEventListener("click", () => { go(parseInt(d.dataset.i, 10)); start(); }));
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((en) => {
        en.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.3 });
      obs.observe(stage);
    } else { start(); }
  }

  /* ------------------------------------------------------------
     BALLOONS
  ------------------------------------------------------------ */
  function makeBalloons(container) {
    if (!container) return;
    const colors = ["#ff8fab", "#ffd88a", "#a8c8ff", "#ff9fb0", "#ffe066", "#ffb4c8", "#c9b8ff"];
    let html = "";
    for (let i = 0; i < 16; i++) {
      const left = (i / 16) * 100 + rand(-4, 4);
      const delay = rand(0, 6), dur = rand(9, 16), size = rand(46, 84);
      const c = colors[i % colors.length];
      html += `<div class="balloon" style="left:${left.toFixed(1)}%;animation-delay:${delay.toFixed(1)}s;animation-duration:${dur.toFixed(1)}s;--bs:${size.toFixed(0)}px;--bc:${c}"></div>`;
    }
    container.innerHTML = html;
  }

  /* ------------------------------------------------------------
     INTRO SEQUENCE
  ------------------------------------------------------------ */
  function startIntro() {
    const line1 = $("#line1"), line2 = $("#line2"), cta = $("#intro-cta"), intro = $("#intro");
    if (!intro) return;
    // personalize intro names from config
    $("#for-seema").textContent = "FOR " + Cfg.birthday.name.toUpperCase();
    line2.innerHTML = `A little birthday surprise from <b>${esc(Cfg.suraj.name)}</b> ❤️`;
    document.title = `Happy Birthday ${Cfg.birthday.name} ❤️ — from ${Cfg.suraj.name}`;
    document.body.classList.add("locked");
    SceneX.setPhase("intro");
    SceneX.intro();

    setTimeout(() => line1.classList.add("show"), 700);
    setTimeout(() => { line1.classList.remove("show"); line2.classList.add("show"); }, 4200);
    setTimeout(() => { line2.classList.add("soft"); cta.classList.add("show"); }, 6800);

    const btn = $("#open-gift-btn");
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.classList.add("pressed");
      AudioX && AudioX.pop();
      flashPhotos();
      SceneX.openGift(() => {});
      await sleep(1500);
      intro.classList.add("done");
      document.body.classList.remove("locked");
      SceneX.ambient();
      AudioX && AudioX.startMusic();
      updateMusicFab();
      await sleep(900);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function flashPhotos() {
    const flash = $("#flash");
    if (!flash) return;
    const imgs = $("#flash .flash-imgs");
    const keys = [];
    const ph = Cfg.photos;
    ["seema", "together", "together2", "memory3"].forEach((k) => { if (ph.seema.includes(k) || (ph[k] && ph[k].length)) keys.push(k); });
    const urls = [photoURL("seema"), photoURL("together"), photoURL("together2")].filter(Boolean);
    if (!urls.length) return;
    let i = 0;
    flash.classList.add("show");
    const iv = setInterval(() => {
      imgs.innerHTML = `<img src="${urls[i % urls.length]}" alt="memory">`;
      i++;
      if (i > urls.length * 2 + 2) { clearInterval(iv); flash.classList.remove("show"); setTimeout(() => { imgs.innerHTML = ""; }, 700); }
    }, 220);
  }

  /* ------------------------------------------------------------
     MUSIC FAB
  ------------------------------------------------------------ */
  function updateMusicFab() {
    const fab = $("#music-fab");
    if (!fab) return;
    fab.textContent = (AudioX && AudioX.isPlaying()) ? "♪" : "♪";
    fab.classList.toggle("on", !!(AudioX && AudioX.isPlaying()));
  }

  window.App = {
    renderAll, startIntro, updateMusicFab
  };
})();
