import "./style.css";
import fart1 from "./sounds/fart-1.mp3";
import fart2 from "./sounds/fart-2.mp3";
import fart3 from "./sounds/fart-3.mp3";
import fart4 from "./sounds/fart-4.mp3";
// @ts-ignore
import SmokeMachine from "@bijection/smoke";

const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
if (!canvas) throw new Error("no canvas, wha?");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var party = SmokeMachine(ctx, [153, 102, 51]);

party.start();

async function shoot() {
  party.addSmoke(innerWidth / 2, innerHeight, Math.random() * 100); // wow we made smoke
}

const farts = [fart1, fart2, fart3, fart4];

export function setupShoot(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    const idx = Math.floor(Math.random() * 3.9999999);
    const fart = new Audio(farts[idx]);
    await Promise.all([shoot(), fart.play()]);
  });
}

setupShoot(document.querySelector<HTMLButtonElement>("#shoot")!);
