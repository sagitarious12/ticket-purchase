
// This code comes from one of my personal projects.

interface Subscriber<T> {
  subscriberName: string;
  cb: (value: T) => void;
  unsub: (value: T) => void;
}

export class BehaviorSubject<T> {
  private _subscribers: Subscriber<T>[] = [];
  private currentValue: T;

  constructor(props: T) {
    this.currentValue = props;
  }

  getCurrentValue = () => {
    return this.currentValue;
  };

  getSubscriberCount = () => {
    return this._subscribers.length;
  };

  subscribe = (
    subscriberName: string,
    cb: (value: T) => void
  ): BehaviorSubject<T> => {
    const foundSubscriberName = this._subscribers.findIndex(
      (value: Subscriber<T>) => value.subscriberName === subscriberName
    );

    // if sub doesnt exist add new one.
    if (foundSubscriberName === -1) {
      this._subscribers.push({
        subscriberName,
        cb,
        unsub: () => {
          return;
        },
      });
      cb(this.currentValue);
      return this;
    }

    // if sub exists just update the callback. dont add new sub
    this._subscribers = this._subscribers.map((sub: Subscriber<T>) => {
      if (sub.subscriberName === subscriberName) {
        return { ...sub, cb: cb };
      }
      return sub;
    });
    return this;
  };

  unsubscribe = (subscriberName: string): BehaviorSubject<T> => {
    const unsubscribed = this._subscribers.splice(
      this._subscribers.findIndex(
        (value) => value.subscriberName === subscriberName
      ),
      1
    );
    unsubscribed.forEach((sub: Subscriber<T>) => {
      if (sub.unsub) sub.unsub(this.currentValue);
    });
    return this;
  };

  onUnsubscribe = (
    subscriberName: string,
    cb: () => void
  ): BehaviorSubject<T> => {
    const foundSubscriberName = this._subscribers.findIndex(
      (value: Subscriber<T>) => value.subscriberName === subscriberName
    );

    // if sub doesnt exist add new one.
    if (foundSubscriberName === -1) {
      this._subscribers.push({
        subscriberName,
        cb: () => {
          return;
        },
        unsub: cb,
      });
      return this;
    }

    // if sub exists just update the unsub callback. dont add new sub
    this._subscribers = this._subscribers.map((sub: Subscriber<T>) => {
      if (sub.subscriberName === subscriberName) {
        return { ...sub, unsub: cb };
      }
      return sub;
    });
    return this;
  };

  next = (next: T) => {
    this.currentValue = next;
    this._subscribers.forEach((sub) => {
      sub.cb(this.currentValue);
    });
  };
}
