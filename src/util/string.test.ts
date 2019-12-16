import { getId } from "./string";

test("id", () => {
  expect(getId("tW8HNAlUXxU")).toBe("tW8HNAlUXxU");
});

test("short-form url", () => {
  expect(getId("https://youtu.be/_E2r2vOlqvA")).toBe("_E2r2vOlqvA");
});

test("long-form url", () => {
  expect(getId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
    "dQw4w9WgXcQ"
  );
});

test("bad url", () => {
  expect(() => getId("asd")).toThrow();
});
