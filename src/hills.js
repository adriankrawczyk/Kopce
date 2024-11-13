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

function hillText() {
  document.querySelector(".exit").addEventListener("click", () => {
    const infoBlock = document.getElementById("info");
    infoBlock.style.opacity = 0;
    infoBlock.style.visibility = "hidden";
  });

  document.querySelectorAll(".point").forEach((point) => {
    const infoText = document.querySelector(".text");
    const infoImage = document.querySelector(".info-image");
    const infoSection = document.querySelector("section");

    point.addEventListener("click", () => {
      const moundInfo = HILL_DATA[point.id];
      if (moundInfo) {
        infoText.innerHTML = moundInfo.title;
        infoImage.src = moundInfo.image;
        infoSection.innerHTML = moundInfo.description;
        showText();
      }
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
    const fixedWidth = 1750;
    const fixedHeight = fixedWidth * 0.6;
    const leftPosition = (containerWidth - fixedWidth) / 2 + 70;
    const topPosition =
      containerHeight - fixedHeight < 0
        ? (containerHeight - fixedHeight) / 2 + 180
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
        }, 50);
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
  const points = [
    { id: "point1", relativeX: 0.385, relativeY: 0.51 },
    { id: "point2", relativeX: 0.395, relativeY: 0.43 },
    { id: "point3", relativeX: 0.44, relativeY: 0.38 },
    { id: "point4", relativeX: 0.48, relativeY: 0.31 },
    { id: "point5", relativeX: 0.49, relativeY: 0.225 },
  ];

  let isResizing = false;
  let resizeTimeout;

  // Create points
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

      const pointSize = hillWidth * 0.03;
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
    }, 200 + index * 200);

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
      }, 150);
    });
  });

  // Create flag
  const flagElement = document.createElement("div");

  const updateFlagPosition = () => {
    const hillContainer = document.getElementById("hill-container");
    const hillWidth = parseFloat(hillContainer.dataset.hillWidth);
    const hillHeight = parseFloat(hillContainer.dataset.hillHeight);
    const hillLeft = parseFloat(hillContainer.dataset.hillLeft);
    const hillTop = parseFloat(hillContainer.dataset.hillTop);
    const pointSize = hillWidth * 0.03;

    if (isResizing) {
      flagElement.style.transition = "none";
    } else {
      flagElement.style.transition = "all 0.3s ease-out";
    }

    const flagX = hillLeft + hillWidth * 0.4745;
    const flagY = hillTop + hillHeight * 0.1226;

    const flagContainer = document.createElement("div");
    const flagWrapper = document.createElement("div");
    Object.assign(flagWrapper.style, {
      transformOrigin: "bottom center",
      width: "52px",
      height: "78px",
      display: "flex",
    });
    flagContainer.classList.add("flag-container");
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
      width: `${pointSize * 0.2}px`,
      height: `${pointSize * 1.4}px`,
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
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
      backgroundColor: "#fff",
      position: "absolute",
      border: "3px solid #333",
      borderLeft: "0px",
      marginTop: `${pointSize * 0.15}px`,
      width: `${pointSize * 0.82}px`,
      height: `${pointSize * 0.49}px`,
      left: `${pointSize * 0.19}px`,
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
  }, 200 + points.length * 200);

  window.addEventListener("hillPositionUpdated", updateFlagPosition);
  window.addEventListener("resize", () => {
    isResizing = true;
    clearTimeout(resizeTimeout);
    updateFlagPosition();

    resizeTimeout = setTimeout(() => {
      isResizing = false;
      updateFlagPosition();
    }, 150);
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
