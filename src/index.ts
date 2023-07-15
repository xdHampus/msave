import { subtract } from "./app";

let loaded: boolean  = false;

function init() {
  if (loaded) {
    return;
  }
  loaded = true;

  browser.runtime.onMessage.addListener((message: any) => {
    if (message.command === "beastify") {
      insertBeast(message.beastURL);
    } else if (message.command === "reset") {
      removeExistingBeasts();
    }
  });
}

function insertBeast(beastURL: string) {
  removeExistingBeasts();
  const beastImage = document.createElement("img");
  beastImage.setAttribute("src", beastURL);
  beastImage.style.height = "100vh";
  beastImage.className = "beastify-image";
  document.body.appendChild(beastImage);
}
function removeExistingBeasts() {
  const existingBeasts = document.querySelectorAll(".beastify-image");
  for (const beast of existingBeasts) {
    beast.remove();
  }
}



init();