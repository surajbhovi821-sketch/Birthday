/* ================= ADMIN / PERSONALIZATION PANEL ================= */
(function () {
  "use strict";
  const { $, $$, esc, Cfg, deepMerge, photoURL, toast, uid } = window.Core;

  let work = null;
  let panel = null;

  /* ---------- path helpers ---------- */
  const getPath = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, path, v) => {
    const ks = path.split(".");
    let cur = o;
    for (let i = 0; i < ks.length - 1; i++) { if (cur[ks[i]] == null) cur[ks[i]] = {}; cur = cur[ks[i]]; }
    cur[ks[ks.length - 1]] = v;
  };

  const RELATIONSHIPS = ["Best Friend", "Friend", "Brother", "Sister", "Cousin", "Partner", "Special Person", "Other"];

  /* ---------- read file as dataURL ---------- */
  const readFile = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  /* ---------- small field builder ---------- */
  const field = (label, path, type, placeholder) => `
    <div class="ad-row">
      <label>${label}</label>
      <input type="${type || "text"}" data-path="${path}" placeholder="${esc(placeholder || "")}">
    </div>`;
  const area = (label, path, rows) => `
    <div class="ad-row">
      <label>${label}</label>
      <textarea data-path="${path}" rows="${rows || 3}"></textarea>
    </div>`;
  const check = (label, path) => `
    <div class="ad-row ad-check">
      <label>${label}</label>
      <input type="checkbox" data-path="${path}">
    </div>`;

  /* ---------- bind simple inputs ---------- */
  function bindInputs(root) {
    $$("input[data-path]", root).forEach((inp) => {
      const p = inp.dataset.path;
      const val = getPath(work, p);
      if (inp.type === "checkbox") inp.checked = !!val;
      else if (val != null) inp.value = val;
      inp.addEventListener("input", () => {
        let v = inp.type === "checkbox" ? inp.checked : inp.value;
        if (inp.type === "number") v = parseFloat(v) || 0;
        setPath(work, p, v);
      });
    });
    $$("textarea[data-path]", root).forEach((ta) => {
      const p = ta.dataset.path;
      const val = getPath(work, p);
      if (Array.isArray(val)) ta.value = val.join("\n\n");
      else if (val != null) ta.value = val;
      ta.addEventListener("input", () => {
        const v = ta.value;
        if (Array.isArray(getPath(work, p))) setPath(work, p, v.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean));
        else setPath(work, p, v);
      });
    });
  }

  /* ---------- photo picker widget ---------- */
  function photoWidget(cat, idx) {
    const key = work.photos[cat][idx];
    const url = photoURL(key);
    return `
    <div class="ad-photo" data-cat="${cat}" data-idx="${idx}">
      ${url ? `<img class="ad-thumb" src="${url}" alt="">` : `<div class="ad-thumb ph-empty">no photo</div>`}
      <div class="ad-photo-actions">
        <label class="mini">Replace<input type="file" accept="image/*" class="ph-file"></label>
        ${key && String(key).indexOf("data:") === 0 ? `<button class="mini warn" data-act="remove">Remove</button>` : ""}
      </div>
      <div class="ad-photo-notes">
        <input data-note="caption" placeholder="Caption" value="${esc((work.notes[key] || {}).caption || "")}">
        <input data-note="date" placeholder="Date" value="${esc((work.notes[key] || {}).date || "")}">
        <input data-note="memory" placeholder="Memory" value="${esc((work.notes[key] || {}).memory || "")}">
      </div>
    </div>`;
  }

  function renderPhotosTab(root) {
    const box = $(".ad-photos", root);
    if (!box) return;
    const cats = Object.keys(work.photos);
    box.innerHTML = cats.map((cat) => `
      <div class="ad-group">
        <div class="ad-group-title">${cat.toUpperCase()} PHOTOS</div>
        <div class="ad-photo-list" data-cat="${cat}">${work.photos[cat].map((_, i) => photoWidget(cat, i)).join("")}</div>
        <button class="mini" data-addcat="${cat}">+ Add photo</button>
      </div>`).join("");
    // photo file replace
    $$(".ph-file", box).forEach((inp) => {
      inp.addEventListener("change", async () => {
        const ph = inp.closest(".ad-photo");
        const cat = ph.dataset.cat, idx = parseInt(ph.dataset.idx, 10);
        if (!inp.files[0]) return;
        const url = await readFile(inp.files[0]);
        const old = work.photos[cat][idx];
        work.photos[cat][idx] = url;
        work.notes[url] = work.notes[old] || { caption: "", date: "", memory: "" };
        renderPhotosTab(root);
        toast("Photo replaced ✓");
      });
    });
    $$("[data-addcat]", box).forEach((b) => b.addEventListener("click", () => {
      const inp = document.createElement("input");
      inp.type = "file"; inp.accept = "image/*";
      inp.onchange = async () => {
        if (!inp.files[0]) return;
        const url = await readFile(inp.files[0]);
        work.photos[b.dataset.addcat].push(url);
        work.notes[url] = { caption: "", date: "", memory: "" };
        renderPhotosTab(root);
        toast("Photo added ✓");
      };
      inp.click();
    }));
    $$("[data-act=remove]", box).forEach((b) => b.addEventListener("click", () => {
      const ph = b.closest(".ad-photo");
      work.photos[ph.dataset.cat].splice(parseInt(ph.dataset.idx, 10), 1);
      renderPhotosTab(root);
    }));
    // note inputs
    $$(".ad-photo input[data-note]", box).forEach((inp) => {
      inp.addEventListener("input", () => {
        const ph = inp.closest(".ad-photo");
        const key = work.photos[ph.dataset.cat][parseInt(ph.dataset.idx, 10)];
        if (!work.notes[key]) work.notes[key] = { caption: "", date: "", memory: "" };
        work.notes[key][inp.dataset.note] = inp.value;
      });
    });
  }

  /* ---------- memories CRUD ---------- */
  function memoryEditor(m, i) {
    return `
    <div class="ad-card" data-mem="${i}">
      <div class="ad-card-head">MEMORY #${i + 1}
        <span>
          <button class="mini" data-move="-1" title="move up">↑</button>
          <button class="mini" data-move="1" title="move down">↓</button>
          <button class="mini warn" data-del>✕</button>
        </span>
      </div>
      <div class="ad-row"><label>Date</label><input data-f="date" value="${esc(m.date)}"></div>
      <div class="ad-row"><label>Title</label><input data-f="title" value="${esc(m.title)}"></div>
      <div class="ad-row"><label>Description</label><textarea data-f="desc" rows="2">${esc(m.desc)}</textarea></div>
      <div class="ad-row"><label>Location</label><input data-f="location" value="${esc(m.location || "")}"></div>
      <div class="ad-row"><label>Video URL (optional)</label><input data-f="video" value="${esc(m.video || "")}"></div>
      <div class="ad-photo-mini">
        ${m.photo ? `<img src="${photoURL(m.photo)}" alt="">` : `<span class="no-ph">no photo</span>`}
        <label class="mini">Photo<input type="file" accept="image/*" data-f-file="photo"></label>
        ${m.photo ? `<button class="mini warn" data-f-clear="photo">clear</button>` : ""}
      </div>
    </div>`;
  }

  function renderMemories(root, containerSel, listKey, editorFn) {
    const box = $(containerSel, root);
    if (!box) return;
    box.innerHTML = work[listKey].map((m, i) => editorFn(m, i)).join("");
    // field binding
    $$(".ad-card", box).forEach((card) => {
      const idx = parseInt(card.dataset.mem, 10);
      const item = work[listKey][idx];
      $$("[data-f]", card).forEach((inp) => {
        const f = inp.dataset.f;
        if (inp.tagName === "TEXTAREA") { item[f] = item[f] || ""; inp.value = item[f]; }
        else item[f] = item[f] || "";
        inp.addEventListener("input", () => { item[f] = inp.value; });
      });
      $$("[data-f-file]", card).forEach((inp) => {
        inp.addEventListener("change", async () => {
          if (!inp.files[0]) return;
          item[inp.dataset.fFile || "photo"] = await readFile(inp.files[0]);
          renderMemories(root, containerSel, listKey, editorFn);
          toast("Photo updated ✓");
        });
      });
      $$("[data-f-clear]", card).forEach((b) => b.addEventListener("click", () => { item[b.dataset.fClear || "photo"] = ""; renderMemories(root, containerSel, listKey, editorFn); }));
      $$("[data-move]", card).forEach((b) => b.addEventListener("click", () => {
        const dir = parseInt(b.dataset.move, 10);
        const arr = work[listKey];
        const j = idx + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[idx], arr[j]] = [arr[j], arr[idx]];
        renderMemories(root, containerSel, listKey, editorFn);
      }));
      $$("[data-del]", card).forEach((b) => b.addEventListener("click", () => {
        work[listKey].splice(idx, 1);
        renderMemories(root, containerSel, listKey, editorFn);
      }));
    });
  }

  /* ---------- tabs ---------- */
  const TABS = [
    { id: "seema", label: "Seema", build: () => `
      <div class="ad-tab">
        <p class="ad-hint">The birthday girl</p>
        ${field("Name", "birthday.name")}
        ${field("Date of birth", "birthday.dob")}
        ${field("Birthday (day & month)", "birthday.birthdayDate")}
        ${field("Birthday year", "birthday.birthdayYear")}
        ${field("Full birthday label", "birthday.fullBirthday")}
        ${field("Age", "birthday.age", "number")}
      </div>` },
    { id: "suraj", label: "Suraj", build: () => `
      <div class="ad-tab">
        <p class="ad-hint">The one who made this surprise</p>
        ${field("Name", "suraj.name")}
        ${area("Short introduction", "suraj.intro", 2)}
        <div class="ad-row">
          <label>Relationship with Seema</label>
          <select data-path="suraj.relationship">
            <option value="">— choose (don't guess!) —</option>
            ${RELATIONSHIPS.map((r) => `<option value="${r}">${r}</option>`).join("")}
          </select>
        </div>
        <div class="ad-row">
          <label>Relationship photo</label>
          <label class="mini">Replace photo<input type="file" accept="image/*" id="suraj-photo-file"></label>
        </div>
        <div class="ad-photo-mini"><img id="suraj-photo-prev" src="${photoURL(work.suraj.photo)}" alt=""></div>
      </div>` },
    { id: "story", label: "Story", build: () => `
      <div class="ad-tab">
        <p class="ad-hint">How your story began</p>
        ${area("How they met", "story.metHow", 2)}
        ${field("When they met", "story.metWhen")}
        ${area("First memory", "story.firstMemory", 2)}
        ${area("Favorite moment", "story.favoriteMoment", 2)}
        ${area("Funny memory", "story.funnyMemory", 2)}
        ${area("Special moment", "story.specialMoment", 2)}
        ${area("Things they experienced together", "story.together", 2)}
        ${area("What Seema means to Suraj", "story.meaning", 3)}
      </div>` },
    { id: "photos", label: "Photos", build: `<div class="ad-tab"><p class="ad-hint">Add, replace & caption photos. Suraj, Seema, together & memories.</p><div class="ad-photos"></div></div>` },
    { id: "memories", label: "Timeline", build: `
      <div class="ad-tab">
        <p class="ad-hint">The "Moments That Matter" timeline</p>
        <div class="ad-mems"></div>
        <button class="btn-add" id="add-mem">+ Add memory</button>
      </div>` },
    { id: "private", label: "Private", build: `
      <div class="ad-tab">
        <p class="ad-hint">"Memories only we understand"</p>
        <div class="ad-privs"></div>
        <button class="btn-add" id="add-priv">+ Add card</button>
      </div>` },
    { id: "messages", label: "Messages", build: () => `
      <div class="ad-tab">
        ${area("A few words from Suraj (blank line = new paragraph)", "words", 7)}
        ${area("The letter to Seema (blank line = new paragraph)", "letter", 8)}
        ${area("Final quote", "finalQuote", 2)}
        ${area("Closing line", "closing", 2)}
      </div>` },
    { id: "video", label: "Video", build: () => `
      <div class="ad-tab">
        ${field("Video URL (mp4/webm)", "video.url")}
        <div class="ad-row"><label>Upload video file</label><label class="mini">Choose file<input type="file" accept="video/*" id="video-file"></label></div>
        ${field("Video title", "video.title")}
        ${field("Placeholder note", "video.note")}
        <div class="ad-row"><label>Thumbnail</label><label class="mini">Upload thumb<input type="file" accept="image/*" id="thumb-file"></label></div>
      </div>` },
    { id: "music", label: "Music", build: () => `
      <div class="ad-tab">
        <p class="ad-hint">Upload a song (mp3), or keep the built-in music-box melody that plays "Happy Birthday".</p>
        <div class="ad-row"><label>Song title</label><input data-path="music.title"></div>
        <div class="ad-row"><label>Upload song</label><label class="mini">Choose file<input type="file" accept="audio/*" id="music-file"></label></div>
        ${check("Use built-in melody (if no song uploaded)", "music.useMusicBox")}
        <p class="ad-tip">♪ Tip: audio works after the first click/tap on the page.</p>
      </div>` },
    { id: "gift", label: "Final Gift", build: () => `
      <div class="ad-tab">
        <p class="ad-hint">What's inside the last gift box</p>
        <div class="ad-row">
          <label>Surprise type</label>
          <select data-path="gift.type">
            <option value="photo">Special photo + message</option>
            <option value="message">Secret message</option>
            <option value="video">Video message</option>
          </select>
        </div>
        <div id="gift-photo-box">
          <div class="ad-row"><label>Photo key or upload</label>
            <select data-path="gift.photo" id="gift-photo-select"></select>
            <label class="mini">Upload<input type="file" accept="image/*" id="gift-photo-file"></label>
          </div>
        </div>
        ${area("Message", "gift.message", 3)}
        <div id="gift-video-box">
          ${field("Video URL", "gift.videoUrl")}
        </div>
      </div>` }
  ];

  /* ---------- panel build ---------- */
  function buildPanel() {
    panel = document.createElement("aside");
    panel.id = "admin";
    panel.innerHTML = `
      <div class="admin-head">
        <h3><span class="gear">⚙</span> Personalize this surprise</h3>
        <button id="admin-close" class="close-x">✕</button>
      </div>
      <nav class="admin-nav">${TABS.map((t) => `<button data-tab="${t.id}">${t.label}</button>`).join("")}</nav>
      <div class="admin-body"></div>
      <div class="admin-foot">
        <button id="admin-save" class="btn-gold">Save &amp; Apply ✨</button>
        <button id="admin-reset" class="link-btn">Reset to defaults</button>
      </div>`;
    document.body.appendChild(panel);
    const fab = document.createElement("button");
    fab.id = "admin-fab";
    fab.title = "Personalize (Suraj)";
    fab.textContent = "⚙";
    document.body.appendChild(fab);

    // nav
    const navBtns = $$(".admin-nav button", panel);
    const body = $(".admin-body", panel);
    const showTab = (id) => {
      navBtns.forEach((b) => b.classList.toggle("on", b.dataset.tab === id));
      const tab = TABS.find((t) => t.id === id);
      body.innerHTML = tab.build();
      bindTab(id);
    };
    navBtns.forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));
    fab.addEventListener("click", () => { work = Core.clone(Cfg); panel.classList.add("open"); showTab("seema"); });
    $("#admin-close", panel).addEventListener("click", () => panel.classList.remove("open"));
    $("#admin-save", panel).addEventListener("click", save);
    $("#admin-reset", panel).addEventListener("click", () => {
      if (confirmReset()) {
        Core.reset();
        window.App.renderAll();
        toast("Back to defaults ✓");
        panel.classList.remove("open");
      }
    });
    showTab("seema");
  }

  function confirmReset() {
    const ov = document.createElement("div");
    ov.className = "confirm";
    ov.innerHTML = `<div class="confirm-card glass"><p>Reset everything to the default content?</p>
      <div><button class="btn-gold" id="cf-yes">Yes, reset</button><button class="link-btn" id="cf-no">Cancel</button></div></div>`;
    document.body.appendChild(ov);
    return new Promise((res) => {
      $("#cf-yes", ov).onclick = () => { ov.remove(); res(true); };
      $("#cf-no", ov).onclick = () => { ov.remove(); res(false); };
    });
  }

  /* ---------- per-tab binding ---------- */
  function bindTab(id) {
    const root = $(".ad-tab", panel);
    if (!root) return;
    bindInputs(root);
    if (id === "suraj") {
      const sel = $('select[data-path="suraj.relationship"]', root);
      sel.value = work.suraj.relationship || "";
      sel.addEventListener("change", () => {
        let v = sel.value;
        if (v === "Other") {
          const inp = document.createElement("input");
          inp.placeholder = "Type your relationship...";
          inp.className = "ad-inline-input";
          sel.parentNode.appendChild(inp);
          inp.focus();
          inp.addEventListener("change", () => { work.suraj.relationship = inp.value; inp.remove(); });
          inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { work.suraj.relationship = inp.value; inp.remove(); } });
        } else work.suraj.relationship = v;
      });
      const phFile = $("#suraj-photo-file", root);
      if (phFile) phFile.addEventListener("change", async () => {
        if (!phFile.files[0]) return;
        work.suraj.photo = await readFile(phFile.files[0]);
        $("#suraj-photo-prev", root).src = work.suraj.photo;
        toast("Suraj's photo updated ✓");
      });
    }
    if (id === "photos") renderPhotosTab(root);
    if (id === "memories") {
      renderMemories(root, ".ad-mems", "memories", memoryEditor);
      $("#add-mem", root).addEventListener("click", () => {
        work.memories.push({ id: uid(), date: "", title: "New memory", desc: "", location: "", photo: "", video: "" });
        renderMemories(root, ".ad-mems", "memories", memoryEditor);
      });
    }
    if (id === "private") {
      const privEditor = (m, i) => `
        <div class="ad-card" data-mem="${i}">
          <div class="ad-card-head">CARD #${i + 1}
            <span>
              <button class="mini" data-move="-1">↑</button>
              <button class="mini" data-move="1">↓</button>
              <button class="mini warn" data-del>✕</button>
            </span>
          </div>
          <div class="ad-row"><label>Title</label><input data-f="title" value="${esc(m.title)}"></div>
          <div class="ad-row"><label>Private caption</label><textarea data-f="caption" rows="2">${esc(m.caption)}</textarea></div>
          <div class="ad-photo-mini">
            ${m.photo ? `<img src="${photoURL(m.photo)}" alt="">` : `<span class="no-ph">no photo</span>`}
            <label class="mini">Photo<input type="file" accept="image/*" data-f-file="photo"></label>
            ${m.photo ? `<button class="mini warn" data-f-clear="photo">clear</button>` : ""}
          </div>
        </div>`;
      renderMemories(root, ".ad-privs", "private", privEditor);
      $("#add-priv", root).addEventListener("click", () => {
        work.private.push({ id: uid(), title: "New memory", caption: "", photo: "" });
        renderMemories(root, ".ad-privs", "private", privEditor);
      });
    }
    if (id === "video") {
      const vf = $("#video-file", root);
      if (vf) vf.addEventListener("change", async () => { if (vf.files[0]) { work.video.url = await readFile(vf.files[0]); toast("Video ready to embed ✓ (Save to apply)"); } });
      const tf = $("#thumb-file", root);
      if (tf) tf.addEventListener("change", async () => { if (tf.files[0]) { work.video.thumb = await readFile(tf.files[0]); toast("Thumbnail set ✓ (Save to apply)"); } });
    }
    if (id === "music") {
      const mf = $("#music-file", root);
      if (mf) mf.addEventListener("change", async () => { if (mf.files[0]) { work.music.file = await readFile(mf.files[0]); work.music.useMusicBox = false; toast("Song uploaded ✓ (Save to apply)"); } });
    }
    if (id === "gift") {
      const typeSel = $('select[data-path="gift.type"]', root);
      typeSel.value = work.gift.type;
      const updateGiftBoxes = () => {
        const isPhoto = work.gift.type === "photo";
        const isVideo = work.gift.type === "video";
        $("#gift-photo-box", root).style.display = isPhoto ? "" : "none";
        $("#gift-video-box", root).style.display = isVideo ? "" : "none";
        const sel = $("#gift-photo-select", root);
        const opts = [];
        Object.keys(work.photos).forEach((cat) => (work.photos[cat] || []).forEach((k) => opts.push([k, cat + " — " + String(k).slice(0, 18)])));
        sel.innerHTML = opts.map(([k, lab]) => `<option value="${esc(k)}" ${k === work.gift.photo ? "selected" : ""}>${esc(lab)}</option>`).join("");
        sel.onchange = () => { work.gift.photo = sel.value; };
      };
      typeSel.addEventListener("change", () => { work.gift.type = typeSel.value; updateGiftBoxes(); });
      updateGiftBoxes();
      const gf = $("#gift-photo-file", root);
      if (gf) gf.addEventListener("change", async () => { if (gf.files[0]) { work.gift.photo = await readFile(gf.files[0]); updateGiftBoxes(); toast("Gift photo set ✓"); } });
    }
  }

  /* ---------- save ---------- */
  function save() {
    const before = JSON.stringify(Cfg);
    Core.applyCfg(Core.clone(work));
    try {
      window.App.renderAll();
      if (window.AudioX) { AudioX.stopMusic(); }
      toast("Saved & applied ✨");
      // re-open admin with new work
      work = Core.clone(Cfg);
      const active = $(".admin-nav button.on", panel);
      if (active) active.click();
    } catch (e) {
      Core.applyCfg(JSON.parse(before));
      console.error(e);
      toast("Something went wrong — nothing changed");
    }
  }

  /* ---------- boot ---------- */
  function bootAdmin() {
    if (document.getElementById("admin")) return;
    buildPanel();
  }
  window.AdminX = { boot: bootAdmin };
})();
