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

test("it unregisters a handler for an event", () => {
  const emitter = new EventEmitter();
  const stub1 = jest.fn();
  const stub2 = jest.fn();

  emitter.on("doStuff", stub1);
  emitter.on("doStuff", stub2);
  emitter.emit("doStuff");
  emitter.emit("doStuff");
  emitter.off("doStuff", stub1);
  emitter.emit("doStuff");
  emitter.emit("doStuff");

  expect(stub1).toBeCalledTimes(2);
  expect(stub2).toBeCalledTimes(4);
});

test("it unregisters all handlers for an event", () => {
  const emitter = new EventEmitter();
  const stub1 = jest.fn();
  const stub2 = jest.fn();

  emitter.on("doStuff", stub1);
  emitter.on("doStuff", stub2);
  emitter.emit("doStuff");
  emitter.emit("doStuff");
  emitter.off("doStuff");
  emitter.emit("doStuff");
  emitter.emit("doStuff");

  expect(stub1).toBeCalledTimes(2);
  expect(stub2).toBeCalledTimes(2);
});
