import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

it('should render App without errors', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBeTruthy();
});
