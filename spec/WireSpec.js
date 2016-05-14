'use strict';

const {mixin, subscribe, store} = require('../react-wire.min');

const componentMock = {};
const PROPERTY_NAME1 = 'propertyName1';
const PROPERTY_NAME2 = 'propertyName2';
const PROPERTY_VALUE = 'propertyValue';

function createComponent(spec) {
    return Object.assign({}, componentMock, spec, mixin);
}

describe('React Wire Test Suite', () => {

    it('Test wire property', done => {
        const component1 = createComponent({
            onClick(value) {
                this.store[PROPERTY_NAME1] = value;
            }
        });
        const component2 = createComponent({
            [subscribe(PROPERTY_NAME1)](value) {
                expect(value).toEqual(PROPERTY_VALUE);
                done();
            }
        });

        component1.componentWillMount();
        component2.componentWillMount();
        component1.onClick(PROPERTY_VALUE);
    });

    it('Test wire property', done => {
        const component2 = createComponent({
            [subscribe(PROPERTY_NAME2)](value) {
                expect(value).toEqual(PROPERTY_VALUE.repeat(2));
                done();
            }
        });
        component2.componentWillMount();
        store[PROPERTY_NAME2] = PROPERTY_VALUE.repeat(2);
    });
});