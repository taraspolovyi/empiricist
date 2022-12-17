import { pipe } from 'fp-ts/function';

import { applyVariation, experiment } from '@empiricist/empiricist';

import { Description as EnabledDescription } from './Description';

export const Description = pipe(
  experiment('description'),
  applyVariation('true', EnabledDescription)
);
