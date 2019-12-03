import { translateError } from "./error";
import AsyncPlayer from "../AsyncPlayer";

describe("translateError", () => {
  test("invalid param", () => {
    expect(translateError(YT.PlayerError.InvalidParam)).toBe(
      AsyncPlayer.Errors.INVALID_PARAMETER
    );
  });
  test("html5 error", () => {
    expect(translateError(YT.PlayerError.Html5Error)).toBe(
      AsyncPlayer.Errors.HTML5_ERROR
    );
  });
  test("video not found", () => {
    expect(translateError(YT.PlayerError.VideoNotFound)).toBe(
      AsyncPlayer.Errors.VIDEO_NOT_FOUND
    );
  });
  test("embed disabled 1", () => {
    expect(translateError(YT.PlayerError.EmbeddingNotAllowed)).toBe(
      AsyncPlayer.Errors.EMBED_DISABLED
    );
  });
  test("embed disabled 2", () => {
    expect(translateError(YT.PlayerError.EmbeddingNotAllowed2)).toBe(
      AsyncPlayer.Errors.EMBED_DISABLED
    );
  });
});
