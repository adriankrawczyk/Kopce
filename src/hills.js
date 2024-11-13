import { showText } from "./hillText.js";

function hills() {
  const container = document.getElementById("hill-container");
  const hillElement = document.createElement("img");
  hillElement.src = `images/hill.png`;
  hillElement.classList.add("hill");
  function adjustHillPosition() {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const fixedWidth = 1750; // 130% of container width
    const fixedHeight = fixedWidth * 0.6; // 5:3 aspect ratio

    // Horizontal centering remains the same
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

    // Update hill dimensions for positioning points
    container.dataset.hillLeft = leftPosition;
    container.dataset.hillWidth = fixedWidth;
    container.dataset.hillTop = topPosition;
    container.dataset.hillHeight = fixedHeight;

    // Trigger point position adjustment
    window.dispatchEvent(new CustomEvent("hillPositionUpdated"));
  }

  // Set initial position when image loads
  hillElement.onload = () => {
    adjustHillPosition();
    container.appendChild(hillElement);
  };

  // Re-adjust everything on resize
  window.addEventListener("resize", adjustHillPosition);

  initializePoints();
}

function positionPoints() {
  const container = document.getElementById("point-container");

  // Define points relative to hill dimensions
  const points = [
    {
      id: "point1",
      relativeX: 0.385,
      relativeY: 0.51,
    },
    {
      id: "point2",
      relativeX: 0.395,
      relativeY: 0.43,
    },
    {
      id: "point3",
      relativeX: 0.44,
      relativeY: 0.38,
    },
    {
      id: "point4",
      relativeX: 0.48,
      relativeY: 0.31,
    },
    {
      id: "point5",
      relativeX: 0.49,
      relativeY: 0.225,
    },
  ];

  points.forEach((point, index) => {
    const pointElement = document.createElement("div");
    pointElement.id = `point${index + 1}`;
    pointElement.classList.add("point");
    pointElement.textContent = index + 1;

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
