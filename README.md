# 🎂 Happy Birthday Seema ❤️ — a 3D surprise from Suraj

A single-file, self-contained **premium cinematic 3D birthday website** created by Suraj for Seema.
Everything (Three.js, photos, styles, scripts, music) is inlined into one file — it works offline,
from a USB stick, or as a file opened directly in any browser.

## 📄 The deliverable

| File | What it is |
|---|---|
| **`index.html`** | The complete birthday experience — open this. |
| `src/` | Editable source (CSS/JS/config) + `build.py` that regenerates `index.html`. |
| `README.md` | This file. |

Open `index.html` in a browser → click **OPEN YOUR SURPRISE 🎁** → the journey begins.

## ✨ The experience (17 chapters)

1. Cinematic opening — particles, glowing 3D gift box, golden light & photo flashes
2. From Suraj → Happy Birthday Seema, 21 years of beautiful memories
3. Our Story ❤️ (how they met, first memory, favorite & funny moments…)
4. Moments That Matter — 3D tilt timeline (add/edit/reorder in admin)
5. Us — In Memories 📸 — polaroid gallery with 3D tilt, lightbox, swipe & captions
6. A Few Words From Suraj (handwritten-style, editable)
7. Memories Only We Understand 🤍
8. A Letter For Seema — 3D envelope that opens, letter reveals line by line
9. 3D birthday cake with **21 candles** → Make a Wish → blow → smoke, fireworks, confetti
10. One Last Surprise 🎁 (reveals a photo / message / video — choose in admin)
11. A Little Something From Suraj 🎬 — video player (upload or URL)
12. Our Memories In Motion 🎞️ — Ken Burns slideshow with music
13. Final Celebration — fireworks, balloons, confetti, hearts
14. Final message & quote
15. ⚙ Admin panel — personalize everything

## ⚙ How Suraj personalizes it

Tap the **⚙ button** (bottom-right, above the music note). The admin panel has tabs for:

- **Seema** — name, DOB, age, birthday label
- **Suraj** — name, photo, **relationship with Seema** (explicitly left blank by default —
  never assumed; pick *Best Friend / Friend / Brother / Sister / Cousin / Partner /
  Special Person / Other / custom*), short introduction
- **Story** — how they met, when, first memory, favorite/funny/special moments…
- **Photos** — add / replace / caption photos in each category (Suraj, Seema, Together, Memories)
- **Timeline** — add, remove, reorder, edit memories (date, title, description, photo, location, video)
- **Private** — "memories only we understand" cards
- **Messages** — words from Suraj, the full letter, final quote & closing
- **Video** — upload a personal video (or paste a URL), thumbnail, placeholder note
- **Music** — upload a song (or keep the built-in music-box *Happy Birthday* melody)
- **Final Gift** — choose what's inside the last box: photo / secret message / video

Press **Save & Apply ✨** — the whole site rebuilds instantly with your content.
Settings are saved in the browser (localStorage), so they persist between visits.

> 💡 Photos, videos & songs uploaded through the admin panel are stored as data inside the
> page itself. To keep the file size reasonable, prefer photos under ~1 MB.

## 🛠 Rebuilding from source

```
python3 src/build.py      # regenerates index.html from src/ (inlines Three.js + images)
```

Then open the new `index.html`. Edit `src/config.js` for default content, `src/css/main.css`
for styling, or `src/js/*.js` for behavior.

## 🎧 Audio notes

- Music starts automatically right after the gift box opens (a gentle synthesized
  music-box *Happy Birthday* — no files needed, works offline).
- The music mutes down softly during the cake "make a wish" moment, then fades back.
- The ♪ button (bottom-right) pauses/resumes music at any time.

## 💡 Tips

- Best experienced on a laptop/desktop with sound on; works on phones too (swipe to navigate
  the gallery & slideshow).
- The intro gift can be opened with a click/tap; scroll to move through the chapters.
- If the browser blocks the in-app preview, download `index.html` and open it directly — it is 100% self-contained.

Made with ❤️ by Suraj, for Seema. 🎂
