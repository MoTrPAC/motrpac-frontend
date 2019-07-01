import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import QuickSearchBox from '../quickSearchBox';

storiesOf('Quick Search Box', module)
  .addDecorator(story => (
    <div className="quick-search-component container d-flex justify-content-end">
      {story()}
    </div>
  ))
  .add('Default', () => <QuickSearchBox />);
