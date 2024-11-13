// Data structure for mound information
const MOUND_DATA = {
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

// Preload images
function preloadImages() {
  Object.values(MOUND_DATA).forEach((mound) => {
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

  // Add point listeners
  document.querySelectorAll(".point").forEach((point) => {
    const infoText = document.querySelector(".text");
    const infoImage = document.querySelector(".info-image");
    const infoSection = document.querySelector("section");

    point.addEventListener("click", () => {
      const moundInfo = MOUND_DATA[point.id];

      if (moundInfo) {
        infoText.innerHTML = moundInfo.title;
        infoImage.src = moundInfo.image;
        infoSection.innerHTML = moundInfo.description;
        showText();
      }
    });
  });
}

preloadImages();

export { hillText, showText };
