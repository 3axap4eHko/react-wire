/*! React Wire v0.0.1 | Copyright (c) 2016 Ivan (3axap4eHko) Zakharchenko*/
'use strict';

const wireEventExpression = /^onWire\w+$/;
const wireListeners = {};
const wireComponents = new WeakMap();
const wireData = {};

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function getEventName(property, action) {
    return `onWire${capitalize(property)}${capitalize(action)}`;
}

function fireEvent(name, ...args) {
    const listeners = wireListeners[name] || [];
    listeners.forEach( component => {
        component[name](...args);
    });
}

const wireHandler = {
    deleteProperty: function(target, property) {
        const eventName = getEventName(property, 'change');
        fireEvent(eventName);
        delete target[property];
        return true;
    },
    set (target, property, value) {
        if(property in target) {
            const eventName = getEventName(property, 'change');
            fireEvent(eventName, value, target[property]);
        } else {
            const eventName = getEventName(property, 'change');
            fireEvent(eventName, value, target[property]);
        }
        target[property] = value;
        return true;
    },
    get (target, property) {
        return target[property];
    }
};
export const store = new Proxy(wireData, wireHandler);

function registerWire(component) {
    var listeners = [];
    Object.keys(component).forEach( name => {
        var matches = name.match(wireEventExpression);
        if(matches) {
            const method = matches[0];
            if(!wireListeners[method]) {
                wireListeners[method] = [];
            }
            wireListeners[method].push(component);
            listeners.push(method);
        }
    }, this);
    wireComponents.set(component, listeners);

    component.store = store;
}
function unregisterWire(component) {
    var listeners = wireComponents.get(component);
    listeners.forEach( name => {
        if(wireListeners[name]) {
            var idx = wireListeners[name].indexOf(component);
            if(~idx) {
                wireListeners[name].splice(idx, 1);
            } else {
                console.log(`Component ${name} does not registered`);
            }
        } else {
            console.log(`Event ${name} does not exists`);
        }
    }, this);
    wireComponents.delete(component);
}

export function subscribe(property) {
    return getEventName(property, 'change');
}

export const mixin = {
    componentWillMount() {
        registerWire(this);
    },
    componentWillUnmount() {
        unregisterWire(this);
    }
};