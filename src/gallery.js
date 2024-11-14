const TRANSITION_DURATION = 500;
const TOTAL_IMAGES = 7;
const WIDTH_PERCENTAGE = 0.75;
const HEIGHT_PERCENTAGE = 0.8;
const OFFSET_MULTIPLIER = 0.5;
const RESIZE_TRANSITION = 300;
const HOVER_SCALE = 1.1;

let currentImageIndex = 0;
let isAnimating = false;
let isResizing = false;

const imageContainer = document.getElementById("image-container");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

imageContainer.style.transition = `
transform ${TRANSITION_DURATION}ms ease-out,
opacity ${TRANSITION_DURATION}ms ease-out,
width ${RESIZE_TRANSITION}ms ease-out,
height ${RESIZE_TRANSITION}ms ease-out
`;

imageContainer.style.cursor = "pointer";
imageContainer.addEventListener("mouseenter", () => {
  if (!isAnimating && !isResizing) {
    imageContainer.style.transform = `scale(${HOVER_SCALE})`;
  }
});

imageContainer.addEventListener("mouseleave", () => {
  if (!isAnimating && !isResizing) {
    imageContainer.style.transform = "scale(1)";
  }
});

const preloadedImages = new Array(TOTAL_IMAGES);
function preloadImages() {
  for (let i = 0; i < TOTAL_IMAGES; i++) {
    preloadedImages[i] = new Image();
    preloadedImages[i].src = `images/gallery/${i + 1}.jpg`;
    preloadedImages[i].onload = () => {
      if (i === currentImageIndex) {
        updateContainerSize();
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".exit").addEventListener("click", () => {
    document.getElementById("video-container").style.opacity = 0;
    document.getElementById("video-container").style.visibility = "hidden";
    document.getElementById("camera-container").style.left = "0px";
  });
});
preloadImages();

const mainImage = new Image();
mainImage.style.width = "100%";
mainImage.style.height = "100%";
mainImage.style.objectFit = "cover";
mainImage.style.display = "block";
mainImage.style.transition = `
  width ${RESIZE_TRANSITION}ms ease-out,
  height ${RESIZE_TRANSITION}ms ease-out,
  margin ${RESIZE_TRANSITION}ms ease-out
`;
imageContainer.appendChild(mainImage);

loadImage(currentImageIndex);
updateArrowVisibility(currentImageIndex);

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};

const handleResize = debounce(() => {
  if (!isAnimating) {
    isResizing = true;
    updateContainerSize();
    setTimeout(() => {
      isResizing = false;
    }, RESIZE_TRANSITION);
  }
}, 16);

window.addEventListener("resize", handleResize);

leftArrow.addEventListener("click", () => {
  if (!isAnimating && !isResizing && currentImageIndex > 0) {
    const nextIndex = currentImageIndex - 1;
    updateArrowVisibility(nextIndex);
    slideImage("left");
  }
});

rightArrow.addEventListener("click", () => {
  if (!isAnimating && !isResizing && currentImageIndex < TOTAL_IMAGES - 1) {
    const nextIndex = currentImageIndex + 1;
    updateArrowVisibility(nextIndex);
    slideImage("right");
  }
});

function getMaxDimensions() {
  const padding = 20;
  return {
    width: Math.floor(window.innerWidth * WIDTH_PERCENTAGE) - padding,
    height: Math.floor(window.innerHeight * HEIGHT_PERCENTAGE) - padding,
  };
}

function slideImage(direction) {
  if (isAnimating || isResizing) return;
  isAnimating = true;
  imageContainer.style.transform =
    direction === "right"
      ? `scale(0.5) translateX(-${100 * OFFSET_MULTIPLIER}%)`
      : `scale(0.5) translateX(${100 * OFFSET_MULTIPLIER}%)`;
  imageContainer.style.opacity = "0";
  setTimeout(() => {
    imageContainer.style.transition = "none";
    loadNewImage(
      direction === "right" ? currentImageIndex + 1 : currentImageIndex - 1,
      () => {
        imageContainer.style.transform =
          direction === "right"
            ? `scale(0) translateX(${100 * OFFSET_MULTIPLIER}%)`
            : `scale(0) translateX(-${100 * OFFSET_MULTIPLIER}%)`;
        imageContainer.style.opacity = "0";
        requestAnimationFrame(() => {
          imageContainer.style.transition = ` 
            transform ${TRANSITION_DURATION}ms ease-out,
            opacity ${TRANSITION_DURATION}ms ease-out,
            width ${RESIZE_TRANSITION}ms ease-out,
            height ${RESIZE_TRANSITION}ms ease-out
          `;
          imageContainer.style.transform = "scale(1) translateX(0)";
          imageContainer.style.opacity = "1";
        });

        setTimeout(() => {
          currentImageIndex =
            direction === "right"
              ? currentImageIndex + 1
              : currentImageIndex - 1;
          isAnimating = false;
        }, TRANSITION_DURATION);
      }
    );
  }, TRANSITION_DURATION);
}

function loadNewImage(index, callback) {
  if (!preloadedImages[index].complete) {
    preloadedImages[index].onload = () => {
      applyImageDimensions(index);
      if (callback) callback();
    };
  } else {
    applyImageDimensions(index);
    if (callback) callback();
  }
}

function applyImageDimensions(index) {
  const dimensions = calculateContainerDimensions(
    preloadedImages[index].naturalWidth,
    preloadedImages[index].naturalHeight
  );

  const buffer = 2;

  requestAnimationFrame(() => {
    imageContainer.style.width = `${dimensions.width}px`;
    imageContainer.style.height = `${dimensions.height}px`;
    mainImage.style.width = `${dimensions.width + buffer * 2}px`;
    mainImage.style.height = `${dimensions.height + buffer * 2}px`;
    mainImage.style.margin = `-${buffer}px`;
    mainImage.src = preloadedImages[index].src;
  });
}

function loadImage(index) {
  loadNewImage(index);
}

function calculateContainerDimensions(imageWidth, imageHeight) {
  const maxDimensions = getMaxDimensions();
  const aspectRatio = imageWidth / imageHeight;
  const windowAspectRatio = maxDimensions.width / maxDimensions.height;

  let width, height;

  if (aspectRatio > windowAspectRatio) {
    width = maxDimensions.width;
    height = width / aspectRatio;

    if (height > maxDimensions.height) {
      height = maxDimensions.height;
      width = height * aspectRatio;
    }
  } else {
    height = maxDimensions.height;
    width = height * aspectRatio;

    if (width > maxDimensions.width) {
      width = maxDimensions.width;
      height = width / aspectRatio;
    }
  }

  return {
    width: Math.floor(width),
    height: Math.floor(height),
  };
}

function updateContainerSize() {
  if (mainImage.src && preloadedImages[currentImageIndex].complete) {
    const dimensions = calculateContainerDimensions(
      preloadedImages[currentImageIndex].naturalWidth,
      preloadedImages[currentImageIndex].naturalHeight
    );

    const buffer = 2;

    requestAnimationFrame(() => {
      imageContainer.style.width = `${dimensions.width}px`;
      imageContainer.style.height = `${dimensions.height}px`;
      mainImage.style.width = `${dimensions.width + buffer * 2}px`;
      mainImage.style.height = `${dimensions.height + buffer * 2}px`;
      mainImage.style.margin = `-${buffer}px`;
    });
  }
}

function updateArrowVisibility(index) {
  leftArrow.style.opacity = index === 0 ? 0 : 1;
  rightArrow.style.opacity = index === TOTAL_IMAGES - 1 ? 0 : 1;
  leftArrow.style.visibility = index === 0 ? "hidden" : "visible";
  rightArrow.style.visibility =
    index === TOTAL_IMAGES - 1 ? "hidden" : "visible";
}
