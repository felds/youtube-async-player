// add yt script
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

type Callback = () => void;

interface Window {
  onYouTubeIframeAPIReady(): void;
  enqueueYouTubeIframeAPIReady(callback: Callback): void;
}

let isReady = false;
const callbacks: Callback[] = [];

window.onYouTubeIframeAPIReady = () => {
  isReady = true;
  callbacks.forEach(callback => callback());
};

window.enqueueYouTubeIframeAPIReady = callback => {
  if (isReady) {
    callback();
  } else {
    callbacks.push(callback);
  }
};
