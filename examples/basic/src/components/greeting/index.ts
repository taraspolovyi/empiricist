import { experiment } from '@empiricist/empiricist';

import { FormalGreeting } from './FormalGreeting';
import { Greeting as DefaultGreeting } from './Greeting';
import { InformalGreeting } from './InformalGreeting';
import { WavingHand } from './WavingHand';

export const Greeting = experiment('greeting', DefaultGreeting)
  .withVariation('formal', FormalGreeting)
  .withVariation(
    'informal',
    experiment('emoji', InformalGreeting).withSiblingAfter('true', WavingHand)
  );
