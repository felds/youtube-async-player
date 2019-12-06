import EventEmitter from "./EventEmitter";

test("it registers and emits a new event", () => {
  const emitter = new EventEmitter();
  const stub = jest.fn();

  emitter.on("doStuff", stub);
  emitter.emit("doStuff");
  emitter.emit("doStuff");
  emitter.emit("doStuff");

  expect(stub).toBeCalledTimes(3);
});

test("it registers an event and runs it only once", () => {
  const emitter = new EventEmitter();
  const stub = jest.fn();

  emitter.once("doStuff", stub);
  emitter.emit("doStuff");
  emitter.emit("doStuff");
  emitter.emit("doStuff");

  expect(stub).toBeCalledTimes(1);
});

test("it unregisters an event", () => {
  const emitter = new EventEmitter();
  const stub = jest.fn();

  emitter.on("doStuff", stub);
  emitter.emit("doStuff", stub);
  emitter.emit("doStuff", stub);
  emitter.off("doStuff", stub);
  emitter.emit("doStuff", stub);
  emitter.emit("doStuff", stub);

  expect(stub).toBeCalledTimes(2);
});
