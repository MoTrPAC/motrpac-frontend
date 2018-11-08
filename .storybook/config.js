import { configure } from '@storybook/react';
import '../src/main.css';
require('bootstrap');

const req = require.context('../src', true, /.stories.jsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
