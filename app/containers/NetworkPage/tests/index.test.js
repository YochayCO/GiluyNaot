import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';

import NetworkPage from '../index';

describe('<NetworkPage />', () => {
  xit('should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale="en">
        <NetworkPage />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
