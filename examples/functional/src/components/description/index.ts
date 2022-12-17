import { applyVariation, experiment } from 'empiricist';
import { pipe } from 'fp-ts/function';

import { Description as EnabledDescription } from './Description';

export const Description = pipe(
  experiment('description'),
  applyVariation('true', EnabledDescription)
);
