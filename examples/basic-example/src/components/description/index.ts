import { createExperiment } from '@experimentally/experimentally';
import { Description as EnabledDescription } from './Description';

export const Description = createExperiment('description').withVariation(
  'true',
  EnabledDescription
);
