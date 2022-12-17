import { pipe } from 'fp-ts/function';

import {
  applySiblingAfter,
  applyVariation,
  experiment,
} from '@empiricist/empiricist';

import { FormalGreeting } from './FormalGreeting';
import { Greeting as DefaultGreeting } from './Greeting';
import { InformalGreeting } from './InformalGreeting';
import { WavingHand } from './WavingHand';

export const Greeting = pipe(
  experiment('greeting', DefaultGreeting),
  applyVariation('formal', FormalGreeting),
  applyVariation(
    'informal',
    pipe(
      experiment('emoji', InformalGreeting),
      applySiblingAfter('true', WavingHand)
    )
  )
);
