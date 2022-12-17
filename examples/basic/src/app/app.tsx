import { Empiricist, ExperimentsConfig } from 'empiricist';
import * as React from 'react';

import { getUrlExperiments } from '@empiricist/example-utils';

import { Description } from '../components/description';
import { Greeting } from '../components/greeting';
import { Heading } from '../components/heading';

export function App() {
  const [experiments] = React.useState<ExperimentsConfig>(getUrlExperiments);

  return (
    <Empiricist experiments={experiments}>
      <Heading>
        <Greeting name="John" firstName="John" lastName="Doe" />
      </Heading>
      <Description />
    </Empiricist>
  );
}

export default App;
