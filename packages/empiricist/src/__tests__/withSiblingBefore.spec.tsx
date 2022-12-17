import { render } from '@testing-library/react';

import { experiment } from '../component';
import { Empiricist } from '../context';

const OriginalComponent = () => <div>Original</div>;
const ExperimentalComponent = () => <div>Experimental</div>;

const TestComponent = experiment('test', OriginalComponent).withSiblingBefore(
  'on',
  ExperimentalComponent
);

describe('withSiblingBefore', () => {
  it('should render only original component, if experiment value does not match provided id', async () => {
    const { queryByText } = render(
      <Empiricist experiments={{ test: 'off' }}>
        <TestComponent />
      </Empiricist>
    );

    const originalElem = await queryByText('Original');
    const experimentalElem = await queryByText('Experimental');

    expect(originalElem).not.toBeNull();
    expect(experimentalElem).toBeNull();
  });

  it('should render experimental component before original, if experiment value match provided id', async () => {
    const { queryByText } = render(
      <Empiricist experiments={{ test: 'on' }}>
        <TestComponent />
      </Empiricist>
    );

    const originalElem = await queryByText('Original');
    const experimentalElem = await queryByText('Experimental');

    expect(originalElem).not.toBeNull();
    expect(experimentalElem).not.toBeNull();

    const siblings = Array.from(originalElem?.parentNode?.children ?? []);

    const originalPosition = siblings.indexOf(originalElem as HTMLElement);
    const experimentalPosition = siblings.indexOf(
      experimentalElem as HTMLElement
    );

    expect(experimentalPosition - originalPosition).toEqual(-1);
  });
});
