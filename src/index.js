const componentsRegistry = new Map();
const eventListeners = new Set();

function registerComponent(Component) {
  if (!componentsRegistry.has(Component)) {
    componentsRegistry.set(Component, []);
    const componentDidMountOrig = Component.prototype.componentDidMount;
    const componentWillUnmountOrig = Component.prototype.componentWillUnmount;

    Component.prototype.componentDidMount = function (...args) {
      componentsRegistry.get(Component).forEach(({ event, key }) => {
        const callback = this[key].bind(this);
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
  return componentsRegistry.get(Component);
}

export function listen(event) {
  return (target, key, descriptor) => {
    function callback(...args) {
      return (descriptor.value || descriptor.initializer.call(this)).apply(this, args);
    }

    const Component = target.constructor;
    const componentListeners = registerComponent(Component);
    componentListeners.push({ event, key });

    return {
      ...descriptor,
      value: callback,
      initializer: () => callback,
    };
  };
}

export function dispatch(event, ...args) {
  eventListeners.forEach(listener => {
    if (listener.event === event) {
      listener.callback(...args);
    }
  });
}

export function trigger(event) {
  return (target, key, descriptor) => {

    function callback(...args) {
      const result = (descriptor.value || descriptor.initializer.call(this)).apply(this, args);
      dispatch(event, result);
    }

    return {
      ...descriptor,
      value: callback,
      initializer: () => callback,
    };
  };
}
