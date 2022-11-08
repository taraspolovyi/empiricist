import { Heading as DefaultHeading } from './Heading';
import { SmallerHeading } from './SmallerHeading';
import { createExperiment } from '@experimentally/core';

export const Heading = createExperiment(
  'heading',
  DefaultHeading
).withVariation('smaller', SmallerHeading);
