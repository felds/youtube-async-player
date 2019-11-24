// add yt script
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

// on ready callbacks
type Callback = () => void;
declare global {
  interface Window {
    onYouTubeIframeAPIReady(): void;
    enqueueYouTubeIframeAPIReady(callback: Callback): void;
  }
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

export class AsyncPlayer {
  private asyncPlayer: Promise<YT.Player>;

  constructor(el: HTMLDivElement, options: YT.PlayerOptions = {}) {
    window.enqueueYouTubeIframeAPIReady(() => {
      this.asyncPlayer = new Promise((resolve, reject) => {
        const x = new YT.Player(el, {
          ...options,
          events: {
            onReady: () => resolve(x)
          }
        });
      });
    });
  }

  /**
   * @todo when does it fail? what happens when it fails?
   */
  async play() {
    return this.asyncPlayer.then(player => {
      // already playing. skip.
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        return;
      }

      return new Promise(win => {
        const stuff = (e: YT.OnStateChangeEvent) => {
          // success
          if (e.data === YT.PlayerState.PLAYING) {
            player.removeEventListener("onStateChange", stuff);
            win();
          }
        };
        player.addEventListener("onStateChange", stuff);
        player.playVideo();
      });
    });
  }

  /**
   * @todo when does it fail? what happens when it fails?
   */
  async pause() {
    return this.asyncPlayer.then(player => {
      if (player.getPlayerState() === YT.PlayerState.PAUSED) {
        return;
      }

      return new Promise(win => {
        const stuff = (e: YT.OnStateChangeEvent) => {
          // success
          if (e.data === YT.PlayerState.PAUSED) {
            player.removeEventListener("onStateChange", stuff);
            win();
          }
        };
        player.addEventListener("onStateChange", stuff);
        player.pauseVideo();
      });
    });
  }
}
