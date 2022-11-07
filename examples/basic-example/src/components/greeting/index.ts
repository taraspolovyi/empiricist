import { createExperiment } from '@experimentally/experimentally';

import { Greeting as DefaultGreeting } from './Greeting';
import { FormalGreeting } from './FormalGreeting';
import { InformalGreeting } from './InformalGreeting';

export const Greeting = createExperiment('greeting', DefaultGreeting)
  .withVariation('formal', FormalGreeting)
  .withVariation('informal', InformalGreeting);
