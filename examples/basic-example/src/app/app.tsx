import { Description } from '../components/description';
import { Greeting } from '../components/greeting';
import { Heading } from '../components/heading';
import { Experimentally, ExperimentsConfig } from '@experimentally/core';
import * as React from 'react';

export function App() {
  const [experiments] = React.useState<ExperimentsConfig>(getExperiments);

  return (
    <Experimentally experiments={experiments}>
      <Heading>
        <Greeting name="John" firstName="John" lastName="Doe" wave />
      </Heading>
      <Description />
    </Experimentally>
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
