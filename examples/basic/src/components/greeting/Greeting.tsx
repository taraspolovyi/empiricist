import * as React from 'react';

export const Greeting: React.FC<{ name: string }> = ({ name }) => (
  <span>Hello {name}</span>
);
