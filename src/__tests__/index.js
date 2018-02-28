import React, { Component, Fragment } from 'react';
import { listen, trigger, dispatch } from '../index';
import renderer from 'react-test-renderer';

const EVENT = 'testEvent';

class TriggerTest extends Component {
  state = {
    testValue: 2,
  };

  componentDidMount() {
    this.trigger1();
    this.trigger2();
    this.dispatch1();
    this.dispatch2();
  }

  @trigger(EVENT)
  trigger1 = () => {
    expect(this.state).toBeDefined();
    return this.state.testValue;
  };

  @trigger(EVENT)
  trigger2() {
    expect(this.state).toBeDefined();
    return this.state.testValue;
  };

  dispatch1 = () => {
    expect(this.state).toBeDefined();
    dispatch(EVENT, this.state.testValue);
  };

  dispatch2() {
    expect(this.state).toBeDefined();
    dispatch(EVENT, this.state.testValue);
  };

  render() {
    return null;
  }
}

class ListenerTest extends Component {
  state = {
    testValue: 1,
  };

  @listen(EVENT)
  listener1 = (value) => {
    expect(this.state).toBeDefined();
    expect(value).not.toBe(this.state.testValue);
  };

  @listen(EVENT)
  listener2(value) {
    expect(this.state).toBeDefined();
    expect(value).not.toBe(this.state.testValue);
  }

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
    return (
      <Fragment>
        <ListenerTest />
        <TriggerTest />
      </Fragment>
    );
  }
}

test('Listen trigger dispatch test', (done) => {
  const context = {};

  function onUpdate({ display }) {
    if (!display) {
      done();
    }
  }

  context.component = renderer.create(<Wrapper onUpdate={onUpdate} />);
  context.tree = context.component.toTree();
  expect(context.component.toJSON()).toBe(null);
});