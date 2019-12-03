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

function translateError(err: YT.PlayerError): AsyncPlayer.Errors {
  return {
    2: AsyncPlayer.Errors.INVALID_PARAMETER,
    5: AsyncPlayer.Errors.HTML5_ERROR,
    100: AsyncPlayer.Errors.VIDEO_NOT_FOUND,
    101: AsyncPlayer.Errors.EMBED_DISABLED,
    150: AsyncPlayer.Errors.EMBED_DISABLED
  }[err];
}

export class AsyncPlayer {
  private player: Promise<YT.Player>;

  constructor(el: HTMLDivElement, options: YT.PlayerOptions = {}) {
    window.enqueueYouTubeIframeAPIReady(() => {
      this.player = new Promise((resolve, reject) => {
        const x = new YT.Player(el, {
          ...options,
          events: {
            onReady: () => resolve(x)
          }
        });
      });
    });
  }

  // TODO: No need to deregister. The callbacks become unavailable once the promise resolves.
  async play() {
    const pl = await this.player;

    return new Promise((win, fail) => {
      function detectSuccess({ data: state }: YT.OnStateChangeEvent) {
        if (state === YT.PlayerState.PLAYING) {
          win();
        }
      }

      function detectError({ data }: YT.OnErrorEvent) {
        fail(translateError(data));
      }

      // register callbacks
      pl.addEventListener("onStateChange", detectSuccess);
      pl.addEventListener("onError", detectError);

      // do the thing
      if (pl.getPlayerState() === YT.PlayerState.PLAYING) {
        /** @todo is this a win? is this a fail? */
        win(); // already playing. skip.
      } else {
        pl.playVideo();
      }
    });
  }

  /**
   * @todo when does it fail? what happens when it fails?
   */
  async pause() {
    return this.player.then(player => {
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

export namespace AsyncPlayer {
  /**
   * Original errors from the docs:
   *
   * 2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
   * 5 – The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
   * 100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
   * 101 – The owner of the requested video does not allow it to be played in embedded players.
   * 150 – This error is the same as 101. It's just a 101 error in disguise!
   */
  export enum Errors {
    INVALID_PARAMETER = "Invalid parameter",
    HTML5_ERROR = "HTML5 error",
    VIDEO_NOT_FOUND = "Video not found",
    EMBED_DISABLED = "Embed disabled by the author"
  }
}
