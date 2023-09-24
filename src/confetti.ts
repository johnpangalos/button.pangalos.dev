import { confetti } from "tsparticles-confetti";
// import horseAudio from "./horse.mp3";
import yeahboyAudio from "./yeah-boy.mp3";
import amongus from "./amongus.png";

const defaults = {
  spread: 360,
  ticks: 100,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
};
async function shoot() {
  await confetti({
    ...defaults,
    particleCount: 20,
    scalar: 2,
    shapes: ["images"],
    shapeOptions: {
      images: {
        src: amongus,
        width: 50,
        height: 64,
      },
    },
  });
}

// const horse = new Audio(horseAudio);
new Audio(yeahboyAudio);

export function setupShoot(element: HTMLButtonElement) {
  const yeahboy = new Audio(yeahboyAudio);
  element.addEventListener("click", async () => {
    await Promise.all([shoot(), yeahboy.play()]);
  });
}
