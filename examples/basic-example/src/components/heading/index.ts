import { createExperiment } from '@experimentally/experimentally';
import { Heading as DefaultHeading } from './Heading';
import { SmallerHeading } from './SmallerHeading';

export const Heading = createExperiment(
  'heading',
  DefaultHeading
).withVariation('smaller', SmallerHeading);
