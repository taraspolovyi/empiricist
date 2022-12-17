import { experiment } from 'empiricist';

import { Heading as DefaultHeading } from './Heading';
import { SmallerHeading } from './SmallerHeading';

export const Heading = experiment('heading', DefaultHeading).withVariation(
  'smaller',
  SmallerHeading
);
