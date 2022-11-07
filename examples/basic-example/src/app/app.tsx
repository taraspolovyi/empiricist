import { Experimentally, Experiments } from '@experimentally/experimentally';
import * as React from 'react';
import { Description } from '../components/description';
import { Greeting } from '../components/greeting';
import { Heading } from '../components/heading';

export function App() {
  const [experiments] = React.useState(() =>
    readExperimentsFromSearchQuery({})
  );

  return (
    <Experimentally experiments={experiments}>
      <Heading>
        <Greeting name="John" firstName="John" lastName="Doe" wave />
      </Heading>
      <Description />
    </Experimentally>
  );
}

function readExperimentsFromSearchQuery(experiments: Experiments): Experiments {
  return [...new URLSearchParams(window.location.search).entries()].reduce(
    (res, curr) => ({ ...res, [curr[0]]: curr[1] }),
    experiments
  );
}

export default App;
