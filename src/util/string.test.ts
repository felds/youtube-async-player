import { idFromURL } from "./string";

test("short-form url", () => {
  expect(idFromURL("https://youtu.be/_E2r2vOlqvA")).toBe("_E2r2vOlqvA");
});

test("long-form url", () => {
  expect(idFromURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
    "dQw4w9WgXcQ"
  );
});

test("bad url", () => {
  expect(() => idFromURL("asd")).toThrow();
});
