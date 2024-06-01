import { loadFirePreset } from "tsparticles-preset-fire";
import { tsParticles } from "tsparticles-engine";
import fartAudio from "./fart.mp3";

async function shoot() {
  await loadFirePreset(tsParticles);
  await tsParticles.load("tsparticles", {
    particles: {
      shape: {
        type: "square", // starting from v2, this require the square shape script
      },
    },
    preset: "fire",
  });
}

export function setupShoot(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    const scream = new Audio(fartAudio);
    await Promise.all([shoot(), scream.play()]);
  });
}
