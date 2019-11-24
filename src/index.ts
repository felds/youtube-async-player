import { AsyncPlayer } from "./youtube";

declare const root: HTMLDivElement;
declare const play: HTMLButtonElement;

const wait = (t: number) => (x: any) =>
  new Promise(win => setTimeout(() => win(x), t));

const pl = new AsyncPlayer(root, {
  videoId: "H6u0VBqNBQ8"
});

play.onclick = () => {
  pl.play()
    .then(wait(3000))
    .then(() => pl.pause());
};
