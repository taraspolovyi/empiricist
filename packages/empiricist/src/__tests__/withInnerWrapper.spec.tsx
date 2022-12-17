import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

import { experiment } from '../component';
import { Empiricist } from '../context';

const OriginalComponent: React.FC<PropsWithChildren> = ({ children }) => (
  <div>Original: {children}</div>
);
const ExperimentalComponent: React.FC<PropsWithChildren> = ({ children }) => (
  <span>Experimental: {children}</span>
);

const TestComponent = experiment('test', OriginalComponent).withInnerWrapper(
  'on',
  ExperimentalComponent
);

describe('withInnerWrapper', () => {
  it('should render only original component, if experiment value does not match provided id', async () => {
    const { container } = render(
      <Empiricist experiments={{ test: 'off' }}>
        <TestComponent>
          <span>Test</span>
        </TestComponent>
      </Empiricist>
    );

    const result = container.textContent;

    expect(result).toEqual('Original: Test');
  });

  it('should render experimental component after original, if experiment value match provided id', async () => {
    const { container } = render(
      <Empiricist experiments={{ test: 'on' }}>
        <TestComponent>
          <span>Test</span>
        </TestComponent>
      </Empiricist>
    );

    const result = container.textContent;

    expect(result).toEqual('Original: Experimental: Test');
  });
});
