const HILL_DATA = {
  point1: {
    title: "Kopiec Jana Pawła II",
    image: "images/janapawla.jpg",
    description:
      "Najmłodszy i najmniejszy z krakowskich kopców, usypany na terenie Zgromadzenia Księży Zmartwychwstańców. Ma 7 metrów.",
  },
  point2: {
    title: "Kopiec Wandy",
    image: "images/wandy.jpg",
    description:
      "Kopiec znajdujący się we wschodniej części Krakowa w Nowej Hucie przy ul. Ujastek Mogilski. Ma 14 metrów.",
  },
  point3: {
    title: "Kopiec Krakusa",
    image: "images/krak.jpg",
    description:
      "Zabytkowy kopiec znajdujący się w Krakowie, w dzielnicy XIII, na prawym brzegu Wisły, w Podgórzu. Ma 16 metrów.",
  },
  point4: {
    title: "Kopiec Kościuszki",
    image: "images/kosciuszki.jpg",
    description:
      "Poświęcony Tadeuszowi Kościuszce, znajduje się na Górze św. Bronisławy w zachodniej części Krakowa. Ma 34.1 metra.",
  },
  point5: {
    title: "Kopiec Józefa Piłsudskiego",
    image: "images/pilsudzkiego.jpg",
    description:
      "Usypany na szczycie Sowińca znajdującego się w Lesie Wolskim. Największy kopiec w Polsce, ma 35 metrów.",
  },
  flag: {
    title: "To już szczyt!",
    image: "images/wi.jpg",
    description:
      "Studenci Wydziału Informatyki AGH (w tym autor tej strony) uwielbiają wyprawy na Krakowskie Kopce 🍌",
  },
};

const HILL_WIDTH = 1750;
const HILL_HEIGHT_RATIO = 0.6;
const CONTAINER_ADJUST = 0.1;
const POINT_SCALE = 0.03;
const FLAG_STICK_WIDTH_SCALE = 0.2;
const FLAG_STICK_HEIGHT_SCALE = 1.4;
const FLAG_MARGIN_TOP_SCALE = 0.15;
const FLAG_STICK_OFFSET = 0.19;
const POINT_POSITIONS = [
  { id: "point1", relativeX: 0.385, relativeY: 0.51 },
  { id: "point2", relativeX: 0.395, relativeY: 0.43 },
  { id: "point3", relativeX: 0.44, relativeY: 0.38 },
  { id: "point4", relativeX: 0.48, relativeY: 0.31 },
  { id: "point5", relativeX: 0.49, relativeY: 0.225 },
];
const FLAG_POSITION = { relativeX: 0.4745, relativeY: 0.1226 };
const FLAG_DIMENSIONS = {
  width: 52,
  height: 78,
  flagWidth: 43,
  flagHeight: 26,
  patternSize: 20,
  patternOffset: 10,
};

// Animation and timing constants
const ANIMATION_DELAYS = {
  HILL_FADE: 50,
  POINT_BASE: 400,
  POINT_INCREMENT: 200,
  RESIZE_DEBOUNCE: 150,
};

function preloadImages() {
  Object.values(HILL_DATA).forEach((mound) => {
    const img = new Image();
    img.src = mound.image;
  });
}

function showText() {
  const infoBlock = document.getElementById("info");
  infoBlock.style.visibility = "visible";
  infoBlock.style.opacity = 1;
}
function hillInfo(id) {
  const infoText = document.querySelector(".text");
  const infoImage = document.querySelector(".info-image");
  const infoSection = document.querySelector("section");
  const info = HILL_DATA[id];
  if (info) {
    infoText.innerHTML = info.title;
    infoImage.src = info.image;
    infoSection.innerHTML = info.description;
    showText();
  }
}
function hillText() {
  document.querySelector(".exit").addEventListener("click", () => {
    const infoBlock = document.getElementById("info");
    infoBlock.style.opacity = 0;
    infoBlock.style.visibility = "hidden";
  });

  document.querySelectorAll(".point").forEach((point) => {
    point.addEventListener("click", () => {
      hillInfo(point.id);
    });
  });
}

function hills() {
  const container = document.getElementById("hill-container");
  const hillElement = document.createElement("img");
  hillElement.src = `images/hill.png`;
  hillElement.classList.add("hill");
  hillElement.style.opacity = "0";

  function calculateHillDimensions(containerWidth, containerHeight) {
    const fixedWidth = HILL_WIDTH;
    const fixedHeight = fixedWidth * HILL_HEIGHT_RATIO;
    const leftPosition =
      (containerWidth - fixedWidth) / 2 + containerHeight * CONTAINER_ADJUST;
    const topPosition =
      containerHeight - fixedHeight < 0
        ? (containerHeight - fixedHeight) / 2 + containerHeight / 3
        : 0;
    return {
      width: fixedWidth,
      height: fixedHeight,
      left: leftPosition,
      top: topPosition,
    };
  }

  function adjustHillPosition() {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const dimensions = calculateHillDimensions(containerWidth, containerHeight);
    Object.assign(hillElement.style, {
      position: "absolute",
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      transform: "scaleX(-1)",
      left: `${dimensions.left}px`,
      top: `${dimensions.top}px`,
    });

    Object.assign(container.dataset, {
      hillLeft: dimensions.left,
      hillWidth: dimensions.width,
      hillTop: dimensions.top,
      hillHeight: dimensions.height,
    });

    window.dispatchEvent(new CustomEvent("hillPositionUpdated"));
  }

  const loadHillImage = () => {
    return new Promise((resolve) => {
      hillElement.onload = () => {
        adjustHillPosition();
        container.appendChild(hillElement);
        setTimeout(() => {
          hillElement.style.opacity = "1";
          resolve(hillElement);
        }, ANIMATION_DELAYS.HILL_FADE);
      };
    });
  };

  window.addEventListener("resize", adjustHillPosition);

  async function initializeWithHill() {
    try {
      await loadHillImage();
      initializePoints();
    } catch (error) {
      console.error("Error loading hill:", error);
    }
  }

  initializeWithHill();
}

function positionPoints() {
  const container = document.getElementById("point-container");
  const points = POINT_POSITIONS;

  let isResizing = false;
  let resizeTimeout;

  points.forEach((point, index) => {
    const pointElement = document.createElement("div");
    pointElement.id = point.id;
    pointElement.classList.add("point");

    const updatePointPosition = () => {
      const hillContainer = document.getElementById("hill-container");
      const hillWidth = parseFloat(hillContainer.dataset.hillWidth);
      const hillHeight = parseFloat(hillContainer.dataset.hillHeight);
      const hillLeft = parseFloat(hillContainer.dataset.hillLeft);
      const hillTop = parseFloat(hillContainer.dataset.hillTop);

      const pointSize = hillWidth * POINT_SCALE;
      const leftPosition = hillLeft + hillWidth * point.relativeX;
      const topPosition = hillTop + hillHeight * point.relativeY;

      if (isResizing) {
        pointElement.style.transition = "none";
      } else {
        pointElement.style.transition = "all 0.3s ease-out";
      }

      Object.assign(pointElement.style, {
        position: "absolute",
        left: `${leftPosition - pointSize / 2}px`,
        top: `${topPosition - pointSize / 2}px`,
        width: `${pointSize}px`,
        height: `${pointSize}px`,
        backgroundColor: "#333",
        borderRadius: "50%",
        pointerEvents: "all",
        cursor: "pointer",
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${pointSize}px`,
      });

      pointElement.textContent = index + 1;
    };

    container.appendChild(pointElement);
    pointElement.style.opacity = "0";
    updatePointPosition();

    setTimeout(() => {
      pointElement.style.opacity = "1";
    }, ANIMATION_DELAYS.POINT_BASE + index * ANIMATION_DELAYS.POINT_INCREMENT);

    window.addEventListener("hillPositionUpdated", () => {
      updatePointPosition();
    });

    window.addEventListener("resize", () => {
      isResizing = true;
      clearTimeout(resizeTimeout);
      updatePointPosition();

      resizeTimeout = setTimeout(() => {
        isResizing = false;
        updatePointPosition();
      }, ANIMATION_DELAYS.RESIZE_DEBOUNCE);
    });
  });

  const flagElement = document.createElement("div");

  const updateFlagPosition = () => {
    const hillContainer = document.getElementById("hill-container");
    const hillWidth = parseFloat(hillContainer.dataset.hillWidth);
    const hillHeight = parseFloat(hillContainer.dataset.hillHeight);
    const hillLeft = parseFloat(hillContainer.dataset.hillLeft);
    const hillTop = parseFloat(hillContainer.dataset.hillTop);
    const pointSize = hillWidth * POINT_SCALE;

    if (isResizing) {
      flagElement.style.transition = "none";
    } else {
      flagElement.style.transition = "all 0.3s ease-out";
    }

    const flagX = hillLeft + hillWidth * FLAG_POSITION.relativeX;
    const flagY = hillTop + hillHeight * FLAG_POSITION.relativeY;

    const flagContainer = document.createElement("div");
    const flagWrapper = document.createElement("div");
    Object.assign(flagWrapper.style, {
      transformOrigin: "bottom center",
      width: `${FLAG_DIMENSIONS.width}px`,
      height: `${FLAG_DIMENSIONS.height}px`,
      display: "flex",
    });
    flagContainer.classList.add("flag-container");
    flagContainer.addEventListener("click", () => {
      hillInfo("flag");
    });
    Object.assign(flagContainer.style, {
      position: "absolute",
      left: `${flagX - pointSize / 2}px`,
      top: `${flagY - pointSize / 2}px`,
      zIndex: 1,
      pointerEvents: "all",
      transformOrigin: "bottom center",
    });
    const stick = document.createElement("div");
    stick.classList.add("stick");
    Object.assign(stick.style, {
      position: "absolute",
      width: `${pointSize * FLAG_STICK_WIDTH_SCALE}px`,
      height: `${pointSize * FLAG_STICK_HEIGHT_SCALE}px`,
      backgroundColor: "black",
      borderRadius: "3px",
      zIndex: 1,
      pointerEvents: "none",
    });

    const flag = document.createElement("div");
    flag.classList.add("flag");
    Object.assign(flag.style, {
      backgroundImage: `
        linear-gradient(45deg, #000 25%, transparent 25%),
        linear-gradient(-45deg, #000 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #000 75%),
        linear-gradient(-45deg, transparent 75%, #000 75%)
      `,
      backgroundSize: `${FLAG_DIMENSIONS.patternSize}px ${FLAG_DIMENSIONS.patternSize}px`,
      backgroundPosition: `0 0, 0 ${FLAG_DIMENSIONS.patternOffset}px, ${FLAG_DIMENSIONS.patternOffset}px -${FLAG_DIMENSIONS.patternOffset}px, -${FLAG_DIMENSIONS.patternOffset}px 0px`,
      backgroundRepeat: "repeat",
      backgroundColor: "#fff",
      position: "absolute",
      border: "3px solid #333",
      borderLeft: "0px",
      marginTop: `${pointSize * FLAG_MARGIN_TOP_SCALE}px`,
      width: `${FLAG_DIMENSIONS.flagWidth}px`,
      height: `${FLAG_DIMENSIONS.flagHeight}px`,
      left: `${pointSize * FLAG_STICK_OFFSET}px`,
      borderRadius: "0% 10% 10% 0%",
      zIndex: 1,
      pointerEvents: "none",
    });

    flagContainer.innerHTML = "";
    flagWrapper.appendChild(stick);
    flagWrapper.appendChild(flag);
    flagContainer.appendChild(flagWrapper);
    flagElement.innerHTML = "";
    flagElement.appendChild(flagContainer);
  };

  container.appendChild(flagElement);
  flagElement.style.opacity = "0";
  updateFlagPosition();

  setTimeout(() => {
    flagElement.style.opacity = "1";
  }, ANIMATION_DELAYS.POINT_BASE + points.length * ANIMATION_DELAYS.POINT_INCREMENT);

  window.addEventListener("hillPositionUpdated", updateFlagPosition);
  window.addEventListener("resize", () => {
    isResizing = true;
    clearTimeout(resizeTimeout);
    updateFlagPosition();

    resizeTimeout = setTimeout(() => {
      isResizing = false;
      updateFlagPosition();
    }, ANIMATION_DELAYS.RESIZE_DEBOUNCE);
  });

  hillText();
}

function initializePoints() {
  const container = document.getElementById("point-container");
  Object.assign(container.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  });
  positionPoints();
}

preloadImages();

export { hills };
