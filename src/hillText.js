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
      switch (point.id) {
        case "point1": {
          infoText.innerHTML = "Kopiec Jana Pawła II";
          infoImage.src = "images/janapawla.jpg";
          infoSection.innerHTML =
            "Najmłodszy i najmniejszy z krakowskich kopców, usypany na terenie Zgromadzenia Księży Zmartwychwstańców. Ma 7 metrów.";
          break;
        }
        case "point2": {
          infoText.innerHTML = "Kopiec Wandy";
          infoImage.src = "images/wandy.jpg";
          infoSection.innerHTML =
            "Kopiec znajdujący się we wschodniej części Krakowa w Nowej Hucie przy ul. Ujastek Mogilski. Ma 14 metrów.";
          break;
        }
        case "point3": {
          infoText.innerHTML = "Kopiec Krakusa";
          infoImage.src = "images/krak.jpg";
          infoSection.innerHTML =
            "Zabytkowy kopiec znajdujący się w Krakowie, w dzielnicy XIII, na prawym brzegu Wisły, w Podgórzu. Ma 16 metrów.";

          break;
        }
        case "point4": {
          infoText.innerHTML = "Kopiec Kościuszki";
          infoImage.src = "images/kosciuszki.jpg";
          infoSection.innerHTML =
            "Poświęcony Tadeuszowi Kościuszce, znajduje się na Górze św. Bronisławy w zachodniej części Krakowa. Ma 34.1 metra.";

          break;
        }
        case "point5": {
          infoText.innerHTML = "Kopiec Józefa Piłsudskiego";
          infoImage.src = "images/pilsudzkiego.jpg";
          infoSection.innerHTML =
            "Usypany na szczycie Sowińca znajdującego się w Lesie Wolskim. Największy kopiec w Polsce, ma 35 metrów.";
          break;
        }
      }
      showText();
    });
  });
}

function showText() {
  const infoBlock = document.getElementById("info");
  infoBlock.style.visibility = "visible";
  infoBlock.style.opacity = 1;
}

hillText();
export { hillText, showText };
