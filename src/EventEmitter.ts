type EventHandler<T> = {
  event: T;
  fn: Function;
  once: boolean;
};

export default class EventEmitter<Event> {
  private handlers: EventHandler<Event>[] = [];

  on(event: Event, fn: Function): void {
    this.handlers.push({ event, fn, once: false });
  }

  once(event: Event, fn: Function): void {
    this.handlers.push({ event, fn, once: true });
  }

  /**
   * Deregister all handlers for the given event.
   */
  off(event: Event): void;

  /**
   * Deregister an specific handler for the given event.
   */
  off(event: Event, handler: Function): void;

  off(event: Event, fn?: Function): void {
    this.handlers = this.handlers.filter(
      handler =>
        fn
          ? handler.event !== event || handler.fn !== fn // specific handler
          : handler.event !== event // all handlers for an event
    );
  }

  emit(event: Event, ...args: any) {
    this.handlers
      .filter(handler => handler.event === event)
      .forEach(handler => {
        handler.fn(...args);
        handler.once && this.off(handler.event, handler.fn);
      });
  }
}
