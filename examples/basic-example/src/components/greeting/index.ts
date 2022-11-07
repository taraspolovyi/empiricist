import { FormalGreeting } from './FormalGreeting';
import { Greeting as DefaultGreeting } from './Greeting';
import { InformalGreeting } from './InformalGreeting';
import { createExperiment } from '@experimentally/core';

export const Greeting = createExperiment('greeting', DefaultGreeting)
  .withVariation('formal', FormalGreeting)
  .withVariation('informal', InformalGreeting);
