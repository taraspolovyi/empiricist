import * as React from 'react';

export const Heading: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h1>{children}</h1>
);
