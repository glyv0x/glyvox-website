window.addEventListener("DOMContentLoaded", () => {
  const colors = [
    "#000000", // Black
    "#990000", // Dark Red
    "#009900", // Dark Green
    "#000099", // Dark Blue
    "#990099", // Purple
    "#999900", // Gold
    "#009999", // Teal
    "#660066", // Deep Purple
    "#006666", // Deep Teal
    "#666600", // Olive
    "#330066", // Royal Purple
    "#663300", // Brown
    "#993300", // Rust
    "#336600", // Forest Green
    "#003366", // Navy Blue
    "#660033", // Burgundy
    "#333366", // Slate Blue
    "#663366", // Plum
    "#336633", // Hunter Green
    "#996633", // Bronze
    "#330033", // Dark Magenta
    "#333300", // Dark Olive
    "#003333", // Dark Cyan
    "#993366", // Rose
    "#996666", // Dusty Rose
    "#666633", // Moss Green
    "#336666", // Steel Blue
    "#663333", // Coffee
    "#996699", // Mauve
    "#669933", // Sage
    "#339966", // Sea Green
    "#993333", // Brick Red
    "#666699", // Dusty Blue
    "#999966", // Khaki
    "#669999", // Blue Gray
    "#996600", // Amber
  ];

  let currentColorIndex = 0;

  const _0x4f2a = (() => {
    const _0x7b8c = [0x6c, 0x6f, 0x67, 0x6f];
    const _0x9d2e = [0x74, 0x69, 0x74, 0x6c, 0x65];
    const _0x3f4a = (c) => c.map((x) => String.fromCharCode(x)).join("");
    const _0x8e1b = [0x3, 0x3, 0x2, 0x2, 0x1, 0x1];
    let _0x5c7d = "";

    for (let _0xaf9e = 0; _0xaf9e < _0x8e1b.length; _0xaf9e += 0x2) {
      _0x5c7d +=
        _0x3f4a(_0x7b8c).repeat(_0x8e1b[_0xaf9e]) +
        _0x3f4a(_0x9d2e).repeat(_0x8e1b[_0xaf9e + 0x1]);
    }

    return _0x5c7d;
  })();

  let _0x9e1d = [];
  let _0x3a8f = null;

  const pentatonicFreqs = [
    // Base octave (original)
    220.0, // A3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.0, // G4

    // One octave up
    440.0, // A4
    523.25, // C5
    587.33, // D5
    659.26, // E5
    783.99, // G5
  ];

  // Initialize audio context immediately
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let isAudioInitialized = false;

  // Title sound via Web Audio; fallback to HTMLAudioElement when needed
  let titleAudioBuffer = null;
  let titleAudioFallback = false;
  let currentTitleSource = null;
  const titleAudioElement = new Audio("sounds/glyvox.mp3");
  titleAudioElement.preload = "auto";

  // Preload glyvox.mp3 immediately on page load
  loadTitleAudioBuffer().catch(() => {
    // Silently fall back to HTMLAudioElement if Web Audio fails
    titleAudioFallback = true;
  });

  async function loadTitleAudioBuffer() {
    if (titleAudioBuffer) {
      return titleAudioBuffer;
    }

    try {
      const response = await fetch("sounds/glyvox.mp3");
      const arrayBuffer = await response.arrayBuffer();

      // Cross-browser compatibility for decodeAudioData
      if (audioContext.decodeAudioData.length === 1) {
        titleAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } else {
        titleAudioBuffer = await new Promise((resolve, reject) => {
          audioContext.decodeAudioData(arrayBuffer, resolve, reject);
        });
      }

      return titleAudioBuffer;
    } catch (err) {
      // Fallback for file:// or blocked fetch
      titleAudioFallback = true;
      return null;
    }
  }

  function cycleBackgroundColor() {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    document.body.style.backgroundColor = colors[currentColorIndex];
  }

  function _0x7d4b() {
    if (_0x3a8f) {
      clearTimeout(_0x3a8f);
    }
    _0x3a8f = setTimeout(() => {
      _0x9e1d.length = 0;
    }, 0xbb8);
  }

  function _0x1c9a(_0x2f8e) {
    _0x9e1d.push(_0x2f8e);
    _0x7d4b();

    const _0x6d4c = _0x9e1d.join("");
    const _0x3e8a = _0x4f2a.slice(0, _0x6d4c.length);

    if (_0x6d4c !== _0x3e8a) {
      _0x9e1d.length = 0;
      _0x9e1d.push(_0x2f8e);
      _0x7d4b();
      return;
    }

    if (_0x6d4c === _0x4f2a) {
      if (_0x3a8f) clearTimeout(_0x3a8f);
      const _0x8e9f =
        [
          104, 116, 116, 112, 115, 58, 47, 47, 103, 108, 121, 118, 111, 120, 46,
          115, 107, 105, 110, 47,
        ]
          .map((c) => String.fromCharCode(c))
          .join("") + atob("MzAzMDM3MzAzMTM4MzMzNTMwMzAzNTM1MzA=");
      window.location.href = _0x8e9f;
    }
  }

  async function initAudioOnFirstClick() {
    if (!isAudioInitialized) {
      // Ensure the context is running
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // Quick, inaudible unlock tone
      const quickOsc = audioContext.createOscillator();
      const quickGain = audioContext.createGain();
      quickGain.gain.value = 0.0001;
      quickOsc.connect(quickGain);
      quickGain.connect(audioContext.destination);

      const now = audioContext.currentTime;
      quickOsc.start(now);
      quickOsc.stop(now + 0.05);

      isAudioInitialized = true;
    }
  }

  async function playRandomNote() {
    try {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
        await initAudioOnFirstClick();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      const randomFreq =
        pentatonicFreqs[Math.floor(Math.random() * pentatonicFreqs.length)];

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(randomFreq, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  }

  // Attach click handler to the logo
  const logo = document.querySelector("img");
  logo.addEventListener("click", () => {
    _0x1c9a("logo");
    cycleBackgroundColor();
    playRandomNote().catch(console.error);
  });

  // Attach event handler to the title
  const title = document.querySelector("h1");

  async function playTitleSound() {
    try {
      if (titleAudioFallback) {
        // Stop previous instance and restart
        titleAudioElement.pause();
        titleAudioElement.currentTime = 0;
        const p = titleAudioElement.play();
        if (p && typeof p.then === "function") {
          p.catch(() => {});
        }
        return;
      }

      if (audioContext.state === "suspended") {
        await audioContext.resume();
        await initAudioOnFirstClick();
      }

      // Stop previous title sound if playing
      if (currentTitleSource) {
        try {
          currentTitleSource.stop();
        } catch (e) {
          // Source may already be stopped
        }
        currentTitleSource = null;
      }

      const buffer = titleAudioBuffer || (await loadTitleAudioBuffer());
      if (!buffer) {
        // As a last resort, use element playback
        titleAudioElement.pause();
        titleAudioElement.currentTime = 0;
        const p = titleAudioElement.play();
        if (p && typeof p.then === "function") {
          p.catch(() => {});
        }
        return;
      }

      // Create new source and track it for stopping
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      currentTitleSource = source;

      // Clear reference when sound ends naturally
      source.onended = () => {
        if (currentTitleSource === source) {
          currentTitleSource = null;
        }
      };

      source.start(0);
    } catch (err) {
      console.error("Title audio failed:", err);
    }
  }

  if ("onpointerup" in window) {
    title.addEventListener("pointerup", (event) => {
      // Trigger on actual press release for all pointer types
      _0x1c9a("title");
      playTitleSound().catch(console.error);
    });
  } else {
    // Fallback for older browsers
    title.addEventListener(
      "touchend",
      () => {
        _0x1c9a("title");
        playTitleSound().catch(console.error);
      },
      {
        passive: true,
      }
    );
    title.addEventListener("click", () => {
      _0x1c9a("title");
      playTitleSound().catch(console.error);
    });
  }

  // Ensure mobile shows a pressed state reliably
  function addPressedHandlersPointer(element) {
    const onDown = () => element.classList.add("pressed");
    const onUp = () => element.classList.remove("pressed");

    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    element.addEventListener("pointerleave", onUp);
  }

  function addPressedHandlersTouchMouse(element) {
    const onDown = () => element.classList.add("pressed");
    const onUp = () => element.classList.remove("pressed");

    element.addEventListener("touchstart", onDown, { passive: true });
    element.addEventListener("touchend", onUp, { passive: true });
    element.addEventListener("touchcancel", onUp, { passive: true });

    element.addEventListener("mousedown", onDown);
    element.addEventListener("mouseup", onUp);
    element.addEventListener("mouseleave", onUp);
  }

  function wirePressedState(elements) {
    elements.forEach((element) => {
      if ("PointerEvent" in window) {
        addPressedHandlersPointer(element);
      } else {
        addPressedHandlersTouchMouse(element);
      }
    });
  }

  const clickable = document.querySelectorAll("a, img, h1");
  wirePressedState(Array.from(clickable));
});
