export type Callback<ObjectType, Payload> = (o: ObjectType, payload: Payload) => void;

export interface Pub<T, U> {
  subscribe(o: T, fn:Callback<T, U>): Callback<T, U>;
  unsubscribe(o: T,fn?: Callback<T, U>): void;
  publish(o: T,payload: U): void;
  size(o: T): number;
}

export default function <O, P>(): Pub<O, P> {

  type OPCallback = Callback<O, P>;

  const subs: Map<O, Set<OPCallback>> = new Map();

  function _remove(o: O): void {
    subs.get(o).clear();
    subs.delete(o);
  }

  function subscribe(o: O, fn: OPCallback): OPCallback {
    if (!subs.has(o)) {
      subs.set(o, new Set());
    }
    subs.get(o).add(fn);
    return fn;
  }

  function unsubscribe(o: O, fn?: OPCallback): void {
    if (subs.has(o)) {
      if (!fn) return _remove(o);
      subs.get(o).delete(fn);
      if (size(o) === 0) _remove(o);
    }
  }

  function publish(o: O, payload: P): void {
    if (subs.has(o)) {
      subs.get(o).forEach((fn: OPCallback): void => fn(o, payload));
    }
  }

  function size(o: O): number {
    return subs.has(o) ? subs.get(o).size : 0;
  }

  return { subscribe, unsubscribe, publish, size };
}
