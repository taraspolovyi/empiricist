import { Description as EnabledDescription } from './Description';
import { createExperiment } from '@experimentally/core';

export const Description = createExperiment('description').withVariation(
  'true',
  EnabledDescription
);
