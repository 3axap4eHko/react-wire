React Wire
==================
Tiny and Fast library for react component communications

## Install
 $ npm install react-wire

## Usage

```javascript

import React from 'react';
import {mixin, subscribe, store} from 'react-wire';

const Button = React.createClass({
    mixins: [mixin],
    onClick() {
        this.store.username = this.props.username;
    },
    render() {
        return (<button onClick={this.onClick}>{this.props.username}</button>);
    }
});

const Display = React.createClass({
    mixins: [mixin],
    getInitialState(){
        return {name: ''}
    },
    [subscribe('username')](name) {
        this.setState({name});
    },
    render() {
        return (<div>{this.state.name}</div>);
    }
});

const Page = React.createClass({
    componentDidMount() {
        setTimeout( () => store['propertyName'] = 'New other user name', 3000 );
    },
    render() {
        return (
            <div>
                <Button username="John Smith"/>
                <Button username="Neo"/>
                <Display />
            </div>
        );
    }
});
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2016 Ivan Zakharchenko