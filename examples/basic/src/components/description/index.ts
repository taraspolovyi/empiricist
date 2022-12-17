import { experiment } from '@empiricist/empiricist';

import { Description as EnabledDescription } from './Description';

export const Description = experiment('description').withVariation(
  'true',
  EnabledDescription
);
