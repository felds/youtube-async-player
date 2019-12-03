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
    this.player = new Promise((win, fail) => {
      window.enqueueYouTubeIframeAPIReady(() => {
        const player = new YT.Player(el, {
          ...options,
          events: {
            onReady: () => win()
          }
        });
      });
    });
  }

  async play() {
    return this.player.then(
      player =>
        new Promise((win, fail) => {
          /** @todo is this a win? is this a fail? */
          if (player.getPlayerState() === YT.PlayerState.PLAYING) win();

          player.addEventListener(
            "onStateChange",
            ({ data: state }: YT.OnStateChangeEvent) =>
              state === YT.PlayerState.PLAYING && win()
          );

          player.addEventListener(
            "onError",
            ({ data: error }: YT.OnErrorEvent) =>
              fail(new Error(translateError(error)))
          );

          player.playVideo();
        })
    );
  }

  async pause() {
    return this.player.then(
      player =>
        new Promise((win, fail) => {
          /** @todo is this a win? is this a fail? */
          if (player.getPlayerState() === YT.PlayerState.PAUSED) win();

          player.addEventListener(
            "onStateChange",
            ({ data: state }: YT.OnStateChangeEvent) =>
              state === YT.PlayerState.PAUSED && win()
          );

          player.addEventListener(
            "onError",
            ({ data: error }: YT.OnErrorEvent) =>
              fail(new Error(translateError(error)))
          );

          player.pauseVideo();
        })
    );
  }
}

export namespace AsyncPlayer {
  /**
   * Translates the original errors from youtube API to domain errors.
   *
   * Original errors from the docs:
   * 2    – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
   * 5    – The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
   * 100  – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
   * 101  – The owner of the requested video does not allow it to be played in embedded players.
   * 150  – This error is the same as 101. It's just a 101 error in disguise!
   */
  export enum Errors {
    INVALID_PARAMETER = "Invalid parameter",
    HTML5_ERROR = "HTML5 error",
    VIDEO_NOT_FOUND = "Video not found",
    EMBED_DISABLED = "Embed disabled by the author"
  }
}
