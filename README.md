React Wire
==================
Tiny and Fast library for react components communications

## Install
 $ npm install react-wire
 
## Reference

#### listen(event: string)
A method decorator that listening specified `event`
```javascript
class Foo extends Component {
  @listen('bar')
  baz() {
    
  }  
}
```

#### dispatch(event: string, ...args)
A function that dispatches specified `event` with provided arguments
```javascript
dispatch('foo', bar, baz);
```

#### trigger(event: string)
A method decorator that triggers a dispatching specified `event` with method result as an event first argument
```javascript
class Foo extends Component {
  @trigger('bar')
  baz() {
    return 'message';
  }  
}
```
the same as 
```javascript
dispatch('bar', 'message');
```
## Usage examples

A simple snackbar example

```javascript
// Snackbar.js
import React, { Component } from 'react';
import { listen } from 'react-wire';

export default class Snackbar extends Component {
  
  state = {
    display: false,
    message: '',
  };
  
  @listen('displaySnackbar')
  displaySnackbar = (display, message) => {
    clearTimeout(this.timerId);
    this.setState({ display, message });
    this.timerId = setTimeout(() => this.setState({ display, message }), 3000);
  };
  
  @listen('closeSnackbar')
  closeSnackbar() {
    this.displaySnackbar(false, this.state.message);
  }
    
  render() {
    const { display, message } = this.state;
    return (
      <div className={display ? 'snackbar--shown' : 'snackbar--hidden'}>
        <button onClick={this.closeSnackbar}>X</button>
        {message}
      </div>
    );
  }
}
```

```javascript
// Menu.js
import React, { Component } from 'react';
import { trigger, dispatch } from 'react-wire';

export default class Menu extends Component {
  
  state = {
    counter: 0,
  };
  
  @trigger('closeSnackbar')
  closeSnackbar() {
    this.setState({ counter: this.state.counter + 1 });
  }
  
  showSnackbar() {
    dispatch('displaySnackbar', true, this.input.value);
  }
    
  render() {
    const { counter } = this.state;
    
    return (
      <div>
        Snackbar closed: {counter} times
        <input ref={input => this.input = input} />
        <button onClick={this.showSnackbar}>Show snackbar</button>
        <button onClick={this.closeSnackbar}>Close snackbar</button>
      </div>
    );
  }
}
```

```javascript
// index.js
import React from 'react';
import { render } from 'react-dom';
import Menu from './Menu.js';
import Snackbar from './Snackbar.js';

render(<div><Menu/><Snackbar/></div>, document.getElementById('app'));
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2016-2018 Ivan Zakharchenko