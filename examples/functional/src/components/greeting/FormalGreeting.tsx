import * as React from 'react';

export const FormalGreeting: React.FC<{
  firstName: string;
  lastName: string;
}> = ({ firstName, lastName }) => (
  <span>
    Good day, {firstName} {lastName}
  </span>
);
