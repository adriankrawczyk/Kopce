function clickEventListeners() {
  document.querySelectorAll(".block-container").forEach((el) => {
    el.style.pointerEvents = "none";
    setTimeout(() => {
      el.style.pointerEvents = "auto";
    }, 300);
  });

  document.getElementById("sun").addEventListener("click", () => {
    location.href =
      "https://www.krakow.pl/odwiedz_krakow/1706,artykul,krakowskie_kopce_.html";
  });
  const basePath = window.location.pathname.split("/")[1];

  document.getElementById("gallery").addEventListener("click", () => {
    location.href = `/${basePath}/gallery.html`;
  });
  document.getElementById("contact").addEventListener("click", () => {
    location.href = `/${basePath}/contact.html`;
  });
  document.getElementById("home").addEventListener("click", () => {
    location.href = `/${basePath}/index.html`;
  });
  const cameraContainer = document.getElementById("camera-container");
  if (cameraContainer) {
    cameraContainer.addEventListener("click", () => {
      document.getElementById("video-container").style.opacity = 1;
      document.getElementById("video-container").style.visibility = "visible";
      cameraContainer.style.left = "-100px";
      cameraContainer.style.pointerEvents = "none";
      setTimeout(() => {
        cameraContainer.style.pointerEvents = "auto";
      }, 1000);
    });
  }
}
export { clickEventListeners };
