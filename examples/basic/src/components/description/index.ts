import { experiment } from 'empiricist';

import { Description as EnabledDescription } from './Description';

export const Description = experiment('description').withVariation(
  'true',
  EnabledDescription
);
