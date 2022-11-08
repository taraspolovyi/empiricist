import * as React from 'react';

export const InformalGreeting: React.FC<{ wave: boolean }> = ({ wave }) => (
  <>
    <span>Hey there</span>
    {wave ? (
      <span role="img" aria-label="Waving hand">
        👋
      </span>
    ) : null}
  </>
);
