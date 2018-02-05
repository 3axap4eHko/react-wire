const componentsRegistry = new Map();
const eventListeners = new Set();

export function listen(event) {
  return (target, key, descriptor) => {
    const callback = descriptor.value || descriptor.initializer();
    const Component = target.constructor;

    if (!componentsRegistry.has(Component)) {
      componentsRegistry.set(Component, []);
      const componentDidMountOrig = Component.prototype.componentDidMount;
      const componentWillUnmountOrig = Component.prototype.componentWillUnmount;

      Component.prototype.componentDidMount = function (...args) {
        componentsRegistry.get(Component).forEach(({ event, key }) => {
          const callback = this[key];
          eventListeners.add({ ref: this, event, callback });
        });
        if (componentDidMountOrig) {
          componentDidMountOrig.call(this, ...args);
        }
      };

      Component.prototype.componentWillUnmount = function (...args) {
        eventListeners.forEach(listener => {
          if (listener.ref === this) {
            eventListeners.delete(listener);
          }
        });
        if (componentWillUnmountOrig) {
          componentWillUnmountOrig.call(this, ...args);
        }
      };
    }

    componentsRegistry.get(target.constructor).push({ event, key });

    return {
      ...descriptor,
      value: callback,
      initializer: () => callback,
    };
  };
}

export function trigger(event) {
  return (target, key, descriptor) => {

    function callback() {
      const result = (descriptor.value || descriptor.initializer())();
      for (const listener of eventListeners) {
        if (listener.event === event) {
          listener.callback(result);
        }
      }
    }

    return {
      ...descriptor,
      value: callback,
      initializer: () => callback,
    };
  };
}
