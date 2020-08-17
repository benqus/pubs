# pubs

Cheers! 🍻

(Work in progress)

Object PubSub - a quick code exercise about a random idea to subscribe to notifications related to an object without extending the event emitter.

It's like a reducer but for any object instance, not just for state management.

> **Danger** - Using a Map can lead to memory leaks so always remove your subscriptions! Pubs will release the object key from the Map if there are no more subscripitions against it but you will have to remove each subscription or use the `pubInstance.unsubscribe(myObject)` to release all subscriptions

### Usage

```ts
import WebSocket, { Server } from 'ws;
import pubs from 'pubs';

interface Payload {
  action: "open"|"message"|"close"|"error";
  message: string;
};

const s = pubs<WebSocket, Payload>();

const server: WebSocket = new Server({ path: '/live' });
server.on('connection', (socket: WebSocket): void => {

  const fn = (socket: object, payload: Payload): void => console.log(socket, payload);

  socket.on('open', (): void => {
    s.subscribe(socket, fn);
  });
  socket.on('message', (data: WebSocket.Data): void => {
    s.publish(socket, { action: "message", message: data.toString('utf8') });
  });
  socket.on('close', (code: number, reason: string): void => {
    s.unsubscribe(socket, fn); // This is important to do!
  });

});

```
