import AsyncPlayer from "../AsyncPlayer";

export function translateError(err: YT.PlayerError): AsyncPlayer.Errors {
  return {
    2: AsyncPlayer.Errors.INVALID_PARAMETER,
    5: AsyncPlayer.Errors.HTML5_ERROR,
    100: AsyncPlayer.Errors.VIDEO_NOT_FOUND,
    101: AsyncPlayer.Errors.EMBED_DISABLED,
    150: AsyncPlayer.Errors.EMBED_DISABLED
  }[err];
}
