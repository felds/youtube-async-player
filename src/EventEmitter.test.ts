import EventEmitter from "./EventEmitter";

test("it registers and emits a new event", () => {
  const emitter = new EventEmitter<"⌘">();
  const stub = jest.fn();

  emitter.on("⌘", stub);
  emitter.emit("⌘");
  emitter.emit("⌘");
  emitter.emit("⌘");

  expect(stub).toBeCalledTimes(3);
});

test("it registers an event and runs it only once", () => {
  const emitter = new EventEmitter<"⌘">();
  const stub = jest.fn();

  emitter.once("⌘", stub);
  emitter.emit("⌘");
  emitter.emit("⌘");
  emitter.emit("⌘");

  expect(stub).toBeCalledTimes(1);
});

test("it unregisters a handler for an event", () => {
  const emitter = new EventEmitter<"⌘">();
  const stub1 = jest.fn();
  const stub2 = jest.fn();

  emitter.on("⌘", stub1);
  emitter.on("⌘", stub2);
  emitter.emit("⌘");
  emitter.emit("⌘");
  emitter.off("⌘", stub1);
  emitter.emit("⌘");
  emitter.emit("⌘");

  expect(stub1).toBeCalledTimes(2);
  expect(stub2).toBeCalledTimes(4);
});

test("it unregisters all handlers for an event", () => {
  const emitter = new EventEmitter<"⌘">();
  const stub1 = jest.fn();
  const stub2 = jest.fn();

  emitter.on("⌘", stub1);
  emitter.on("⌘", stub2);
  emitter.emit("⌘");
  emitter.emit("⌘");
  emitter.off("⌘");
  emitter.emit("⌘");
  emitter.emit("⌘");

  expect(stub1).toBeCalledTimes(2);
  expect(stub2).toBeCalledTimes(2);
});
