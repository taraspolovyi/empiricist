import * as React from 'react';

import { Empiricist, ExperimentsConfig } from '@empiricist/empiricist';

import { Description } from '../components/description';
import { Greeting } from '../components/greeting';
import { Heading } from '../components/heading';

export function App() {
  const [experiments] = React.useState<ExperimentsConfig>(getExperiments);

  return (
    <Empiricist experiments={experiments}>
      <Heading>
        <Greeting name="John" firstName="John" lastName="Doe" />
      </Heading>
      <Description />
    </Empiricist>
  );
}

function getExperiments(): ExperimentsConfig {
  const searchParams = new URLSearchParams(window.location.search);

  const experiments: ExperimentsConfig = {};

  searchParams.forEach((value, key) => {
    experiments[key] = value;
  });

  return experiments;
}

export default App;
