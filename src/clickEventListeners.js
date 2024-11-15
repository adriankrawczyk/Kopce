function clickEventListeners() {
  document.querySelectorAll(".block-container").forEach((el) => {
    el.style.pointerEvents = "none";
    setTimeout(() => {
      el.style.pointerEvents = "auto";
    }, 300);
  });

  document.getElementById("gallery").addEventListener("click", () => {
    window.location.replace("gallery.html");
  });
  document.getElementById("contact").addEventListener("click", () => {
    window.location.replace("contact.html");
  });
  document.getElementById("home").addEventListener("click", () => {
    window.location.replace("index.html");
  });
  const cameraContainer = document.getElementById("camera-container");
  if (cameraContainer) {
    cameraContainer.addEventListener("click", () => {
      document.getElementById("video-container").style.opacity = 1;
      document.getElementById("video-container").style.visibility = "visible";
      cameraContainer.style.left = "-130px";
      cameraContainer.style.pointerEvents = "none";
      setTimeout(() => {
        cameraContainer.style.pointerEvents = "auto";
      }, 1000);
    });
  }
}
export { clickEventListeners };
