import { configure, addDecorator } from '@storybook/react';
import '../src/main.css';
import StoryRouter from 'storybook-react-router';

require('bootstrap');

// FIXES ISSUE WITH REACT-ROUTER AND STORYBOOK INTEGRATION
addDecorator(StoryRouter());

const req = require.context('../src', true, /.stories.jsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
