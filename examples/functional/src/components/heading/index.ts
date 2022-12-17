import { applyVariation, experiment } from 'empiricist';
import { pipe } from 'fp-ts/function';

import { Heading as DefaultHeading } from './Heading';
import { SmallerHeading } from './SmallerHeading';

export const Heading = pipe(
  experiment('heading', DefaultHeading),
  applyVariation('smaller', SmallerHeading)
);
