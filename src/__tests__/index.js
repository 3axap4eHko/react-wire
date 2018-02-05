import React, { Component } from 'react';
import { listen, trigger } from '../index';
import renderer from 'react-test-renderer';

class Test extends Component {
  @listen('test')
  listener1 = (...args) => {
    console.log('initializer listener');
  };

  @listen('test')
  listener2() {
    console.log('value listener');
  }

  componentDidMount() {
    this.trigger1();
    this.trigger2();
  }

  @trigger('test')
  trigger1 = () => {
    console.log('initializer trigger');
  };

  @trigger('test')
  trigger2() {
    console.log('value trigger');
  };

  render() {
    return null;
  }
}

class Wrapper extends Component {

  state = {
    display: true,
  };

  componentWillMount() {
    setTimeout(() => this.setState({ display: false }), 1000);
  }

  componentDidUpdate() {
    this.props.onUpdate(this.state);
  }

  render() {
    if (!this.state.display) {
      return null;
    }
    return <Test />;
  }
}

test('test', (done) => {
  const context = {};

  function onUpdate({ display }) {
    if(!display) {
      done();
    }
  }

  context.component = renderer.create(<Wrapper onUpdate={onUpdate} />);
  context.tree = context.component.toTree();
  expect(context.component.toJSON()).toBe(null);
});