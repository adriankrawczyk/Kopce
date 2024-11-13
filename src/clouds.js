function createClouds(config) {
  const container = document.getElementById("cloud-container");
  let clouds = [];
  let dimensions = { width: 0, height: 0 };
  let grid = null;
  let cellSize = { width: 0, height: 0 };
  let animationFrameId = null;
  let baseWidth = 0;

  function updateDimensions() {
    dimensions = {
      width: container.clientWidth,
      height: container.clientHeight,
    };
    if (!baseWidth) baseWidth = dimensions.width;
    cellSize = {
      width: dimensions.width / config.gridCells,
      height: dimensions.height / config.gridCells,
    };
  }

  function initializeGrid() {
    grid = Array(config.gridCells)
      .fill()
      .map(() => Array(config.gridCells).fill(1));
  }

  function getRandomPosition() {
    const positions = [];
    let totalWeight = 0;
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[0].length; y++) {
        totalWeight += grid[x][y];
        positions.push({ x, y, weight: grid[x][y] });
      }
    }
    let random = Math.random() * totalWeight;
    for (const pos of positions) {
      random -= pos.weight;
      if (random <= 0) {
        return { x: pos.x, y: pos.y };
      }
    }
    return {
      x: Math.floor(Math.random() * grid.length),
      y: Math.floor(Math.random() * grid[0].length),
    };
  }

  function updateGrid(centerX, centerY, width) {
    const radius = Math.ceil(width) * config.widthDistanceMultiplier;

    for (let x = centerX - radius; x <= centerX + radius; x++) {
      for (let y = centerY - radius; y <= centerY + radius; y++) {
        if (isOutOfBounds(x, y)) continue;

        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        const factor = distance === 0 ? 0 : 1 - 1 / distance;
        grid[x][y] *= factor;
      }
    }
  }

  function createCloud(spawnAtRight = false) {
    const { width, height } = dimensions;

    const randomWidth =
      baseWidth * getRandomFloat(config.sizes.min, config.sizes.max);
    const randomCloudIndex = getRandomInt(0, config.maxCloudIndex + 1);
    const speed = getRandomFloat(config.speed.min, config.speed.max);

    const position = getRandomPosition();
    const y = Math.min(
      Math.max(position.y * cellSize.height, 0),
      height - randomWidth
    );
    const x = spawnAtRight ? width + 1 : position.x * cellSize.width;

    const cloudElement = document.createElement("img");
    cloudElement.classList.add("cloud");
    cloudElement.src = `images/clouds/cloud${randomCloudIndex}.png`;

    Object.assign(cloudElement.style, {
      width: randomWidth + "px",
      left: x + "px",
      top: y + "px",
      position: "absolute",
      zIndex: Math.random() <= 0.5 ? 0 : 2,
    });

    setTimeout(() => {
      cloudElement.style.transition = "left 0.016s linear";
    }, 0);

    updateGrid(
      Math.floor(x / cellSize.width),
      Math.floor(y / cellSize.height),
      randomWidth / cellSize.width
    );

    return {
      element: cloudElement,
      x,
      y,
      width: randomWidth,
      speed,
      cloudIndex: randomCloudIndex,
    };
  }

  function animate() {
    const { width } = dimensions;

    clouds.forEach((cloud) => {
      cloud.x -= cloud.speed;
      cloud.element.style.left = `${cloud.x}px`;

      if (cloud.x + cloud.width < -1) {
        const newCloud = createCloud(true);
        cloud.element.remove();
        const index = clouds.indexOf(cloud);
        clouds[index] = newCloud;
        container.appendChild(newCloud.element);
      }
    });
    animationFrameId = requestAnimationFrame(animate);
  }

  // Resize handler no longer updates cloud positions
  function handleResize() {
    updateDimensions();
  }

  function initialize() {
    updateDimensions();
    initializeGrid();
    clouds = [];

    for (let i = 0; i < config.cloudCount; i++) {
      const cloud = createCloud();
      clouds.push(cloud);
      container.appendChild(cloud.element);
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", handleResize);

  initialize();

  return {
    destroy: () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      container.innerHTML = "";
      clouds = [];
    },
  };

  function isOutOfBounds(x, y) {
    return x < 0 || x >= grid.length || y < 0 || y >= grid[0].length;
  }

  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getRandomInt(min, max) {
    return Math.floor(getRandomFloat(Math.ceil(min), Math.floor(max)));
  }
}

function clouds() {
  const config = {
    cloudCount: 20,
    sizes: {
      min: 0.05,
      max: 0.15,
    },
    speed: {
      min: 0.5,
      max: 1.2,
    },
    gridCells: 50,
    maxCloudIndex: 8,
    widthDistanceMultiplier: 4,
  };
  createClouds(config);
}

export { clouds };
