import { pipe } from 'fp-ts/function';

import { applyVariation, experiment } from '@empiricist/empiricist';

import { Heading as DefaultHeading } from './Heading';
import { SmallerHeading } from './SmallerHeading';

export const Heading = pipe(
  experiment('heading', DefaultHeading),
  applyVariation('smaller', SmallerHeading)
);
