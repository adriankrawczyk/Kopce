import { showText } from "./hillText.js";
import { hillText } from "./hillText.js";

function hills() {
  const container = document.getElementById("hill-container");
  const hillElement = document.createElement("img");
  hillElement.src = `../images/hill.png`;
  hillElement.classList.add("hill");
  hillElement.style.transition = "opacity 0.3s ease-out";
  hillElement.style.opacity = "0";

  function adjustHillPosition() {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const fixedWidth = 1750;
    const fixedHeight = fixedWidth * 0.6;
    const leftPosition = (containerWidth - fixedWidth) / 2;
    const topPosition =
      containerHeight - fixedHeight < 0
        ? (containerHeight - fixedHeight) / 2 + 170
        : 0;

    Object.assign(hillElement.style, {
      position: "absolute",
      width: `${fixedWidth}px`,
      height: `${fixedHeight}px`,
      transform: "scaleX(-1)",
      left: `${leftPosition}px`,
      top: `${topPosition}px`,
    });

    container.dataset.hillLeft = leftPosition;
    container.dataset.hillWidth = fixedWidth;
    container.dataset.hillTop = topPosition;
    container.dataset.hillHeight = fixedHeight;

    // Trigger point position adjustment
    window.dispatchEvent(new CustomEvent("hillPositionUpdated"));
  }

  // Create promise to handle hill image loading
  const loadHillImage = () => {
    return new Promise((resolve) => {
      hillElement.onload = () => {
        adjustHillPosition();
        container.appendChild(hillElement);
        // Trigger the fade-in animation after a brief delay
        setTimeout(() => {
          hillElement.style.opacity = "1";
          resolve(hillElement);
        }, 50);
      };
    });
  };

  // Re-adjust everything on resize
  window.addEventListener("resize", adjustHillPosition);

  // Initialize points after hill image is loaded
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

  points.forEach((point, index) => {
    const pointElement = document.createElement("div");
    pointElement.id = `point${index + 1}`;
    pointElement.classList.add("point");
    pointElement.textContent = index + 1;
    pointElement.style.transition =
      "opacity 0.3s ease-out, transform 0.3s ease-out";
    pointElement.style.opacity = "0";

    const adjustPosition = () => {
      const hillContainer = document.getElementById("hill-container");
      const hillLeft = parseFloat(hillContainer.dataset.hillLeft || 0);
      const hillWidth = parseFloat(hillContainer.dataset.hillWidth || 0);
      const hillTop = parseFloat(hillContainer.dataset.hillTop || 0);
      const hillHeight = parseFloat(hillContainer.dataset.hillHeight || 0);
      const pointSize = hillWidth * 0.03;
      const leftPosition = hillLeft + hillWidth * point.relativeX;
      const topPosition = hillTop + hillHeight * point.relativeY;

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
    };

    adjustPosition();
    container.appendChild(pointElement);
    hillText();

    setTimeout(() => {
      pointElement.style.opacity = "1";
    }, 200 + index * 200); // Stagger the points' appearance

    window.addEventListener("hillPositionUpdated", adjustPosition);
    window.addEventListener("resize", adjustPosition);
  });
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

export { hills };
