import { confetti } from "tsparticles-confetti";
import horseAudio from "./horse.mp3"

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
    shapes: ["text"],
    shapeOptions: {
      text: {
        value: ["🦄", "🌈"],
      },
    },
  });
}

const horse = new Audio(horseAudio)
export function setupShoot(element: HTMLButtonElement) {
  element.addEventListener('click', async () => {
    await Promise.all([
      shoot(), horse.play()
    ])
  })
}

