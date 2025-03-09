const frames = {
  currentIndex: 0,
  maxIndex: 64,
};

let imagesLoaded = 0;
const allImages = [];
let preloadImages = () => {
  for (let i = 1; i <= frames.maxIndex; i++) {
    const imageURL = `/Projects/Airpodspro/src/assets/airpodstrack/${String(
      i
    ).padStart(4, "0")}.png`;
    const img = new Image();
    img.src = imageURL;
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === frames.maxIndex) {
        loadImage(frames.currentIndex);
      }
    };
    allImages.push(img);
  }
};

let loadImage = (index) => {
  if (index >= 0 && index <= frames.maxIndex) {
    const img = allImages[index];
  }
};

preloadImages();
