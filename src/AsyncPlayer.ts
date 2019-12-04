import "./util/youtube";
import { translateError } from "./util/error";
import { idFromURL } from "./util/string";

type AsyncPlayerOptions = YT.PlayerOptions & {
  videoUrl?: string;
};

class AsyncPlayer {
  private player: Promise<YT.Player>;

  constructor(el: HTMLDivElement, options: AsyncPlayerOptions = {}) {
    this.player = new Promise((win, fail) => {
      const videoId = options.videoUrl
        ? idFromURL(options.videoUrl)
        : options.videoId;
      window.enqueueYouTubeIframeAPIReady(() => {
        const player: YT.Player = new YT.Player(el, {
          ...options,
          videoId,
          events: {
            onReady: () => win(player)
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

namespace AsyncPlayer {
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

export default AsyncPlayer;
