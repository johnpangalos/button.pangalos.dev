import "./style.css";
import { setupShoot } from "./confetti";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="flex items-center justify-center h-full">
    <button id="shoot"
      type="button"
      class="bg-pink-200 text-gray-700 text-3xl rounded-full w-44 h-44 font-bold border-gray-700 border-2">
      Woohoo!
    </button>
  </div>
`;

setupShoot(document.querySelector<HTMLButtonElement>("#shoot")!);
