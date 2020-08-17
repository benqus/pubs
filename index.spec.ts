import { expect } from 'chai';
import pubs, { Pub } from './dist';

type Payload = {
  [k: string]: any;
}

describe('Pubs', () => {

  it('interface', () => {
    const pub: Pub<object, Payload> = pubs<object, Payload>();

    expect(pub.publish).to.be.a('function');
    expect(pub.subscribe).to.be.a('function');
    expect(pub.unsubscribe).to.be.a('function');
    expect(pub.size).to.be.a('function');
  });

  it('subscribes and returns correct size', () => {
    const pub: Pub<object, Payload> = pubs<object, Payload>();
    const obj: object = {};

    pub.subscribe(obj, (): void => {});

    expect(pub.size(obj)).to.equal(1);
  });

  it('publishes', () => {
    const pub: Pub<object, Payload> = pubs<object, Payload>();
    const obj: object = {};
    const payload: object = {};

    pub.subscribe(obj, (obj, payload): void => {
      expect(obj).to.equal(obj);
      expect(payload).to.equal(payload);
    });
    pub.publish(obj, payload);
  });

  it('publishes - on same object', () => {
    const pub: Pub<object, Payload> = pubs<object, Payload>();
    const obj1: object = {};
    const obj2: object = {};
    let called: boolean = false;

    pub.subscribe(obj1, (obj, payload): void => {
      called = true;
    });
    
    pub.publish(obj2, {});

    expect(called).to.be.false;
  });

  it('unsubscribes all', () => {
    const pub: Pub<object, Payload> = pubs<object, Payload>();
    const obj: object = {};
    let called: boolean = false;

    pub.subscribe(obj, (obj, payload): void => {
      called = true;
    });
    pub.unsubscribe(obj);
    
    pub.publish(obj, {});

    expect(pub.size(obj)).to.equal(0);
    expect(called).to.be.false;
  });

  it('unsubscribes one callback', () => {
    const pub: Pub<object, Payload> = pubs<object, Payload>();
    const obj: object = {};
    let calls: number = 0;
    const fn1 = (obj, payload): void => { calls++ };
    const fn2 = (obj, payload): void => { calls++ };

    pub.subscribe(obj, fn1);
    pub.subscribe(obj, fn2);
    pub.unsubscribe(obj, fn1);
    pub.publish(obj, {});

    expect(pub.size(obj)).to.equal(1);
    expect(calls).to.equal(1);
  });

});
