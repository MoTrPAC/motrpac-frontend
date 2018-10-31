import { configure } from '@storybook/react';
import '../src/index.css';
import '../src/main.css';
import 'bootstrap';

const req = require.context('../src', true, /.stories.jsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
