type EventHandler = {
  event: string;
  fn: Function;
  once: boolean;
};

export default class EventEmitter {
  private handlers: EventHandler[] = [];

  on(event: string, fn: Function): void {
    this.handlers.push({ event, fn, once: false });
  }

  once(event: string, fn: Function): void {
    this.handlers.push({ event, fn, once: true });
  }

  /**
   * Deregister all handlers for the given event.
   */
  off(event: string): void;

  /**
   * Deregister an specific handler for the given event.
   */
  off(event: string, handler: Function): void;

  off(event: string, fn?: Function): void {
    this.handlers = this.handlers.filter(
      handler => handler.event !== event || handler.fn !== fn
    );
  }

  emit(event: string, ...args: any) {
    this.handlers
      .filter(handler => handler.event === event)
      .forEach(handler => {
        handler.fn(...args);
        handler.once && this.off(handler.event, handler.fn);
      });
  }
}
