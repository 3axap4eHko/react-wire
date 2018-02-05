React Wire
==================
Tiny and Fast library for react components communications

## Install
 $ npm install react-wire

## Usage

```javascript
// Menu.js
import React, { Component } from 'react';
import { listen } from 'react-wire';

export default class Menu extends Component {
  
  state = {
    display: false,
  };
  
  @listen('toggleMenu')
  toggleMenu() {
    this.setState({ display: !this.state.display });
  }
  render() {
    if(!this.state.display) {
      return null;
    }
    return (
      <div>
        ...Menu
        <button onClick={this.toggleMenu}>Close</button>
      </div>
    );
  }
}
```

```javascript
// CloseMenuButton.js
import React, { Component } from 'react';
import { trigger } from 'react-wire';

export default class CloseMenuButton extends Component {
  
  @trigger('toggleMenu')
  closeMenu() {
    console.log('close menu trigger');
  }
  render() {
    return (
      <button onClick={this.closeMenu}>Close</button>
    );
  }
}
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2016-2018 Ivan Zakharchenko