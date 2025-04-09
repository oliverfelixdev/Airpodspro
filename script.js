const smoothScroll = () => {
  const lenis = new Lenis({
    duration: 1.2,
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
};
smoothScroll();

const trackAnimation = () => {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  const frames = {
    currentIndex: 0,
    maxIndex: 64,
  };

  let imagesLoaded = 0;
  let images = [];
  function preloadImages() {
    for (let i = 0; i < frames.maxIndex; i++) {
      const paddedNumbers = String(i + 1).padStart(4, "0");
      const imageUrl = `./images/${paddedNumbers}.png`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === frames.maxIndex) {
          loadImage(frames.currentIndex);
          startAnimation();
        }
      };
      images.push(img);
    }
  }

  function loadImage(index) {
    if (index >= 0 && index <= frames.maxIndex) {
      const img = images[index];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      frames.currentIndex = index;
    }
  }

  function startAnimation() {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".parent",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });

    tl.to(frames, {
      currentIndex: frames.maxIndex,
      onUpdate: function () {
        loadImage(Math.floor(frames.currentIndex));
      },
    });
  }
  preloadImages();
};
trackAnimation();

const textAnimation = () => {
  gsap.fromTo(
    ".animate-text",
    {
      x: -10,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration: 1.5,
      ease: "expo.inOut",
      stagger: 0.3,
    }
  );
};

textAnimation();

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const phrases = ["SCROLL TO ANIMATE", "SCROLL", "KEEP SCROLLING"];

const el = document.querySelector(".text");
const fx = new TextScramble(el);

let counter = 0;

const next = () => {
  fx.setText(phrases[counter]).then(() => {
    // If it's the first time, wait only 800ms, otherwise 5s
    const delay = counter === 0 ? 3000 : 3000;
    setTimeout(next, delay);
  });
  counter = (counter + 1) % phrases.length;
};
next();
