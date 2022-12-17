import * as React from 'react';

import { ExperimentsConfig } from './types';
import { constNull } from './utils';

export interface ExpContextValue {
  getExperiment(id: string | null): string | null;
}

export const ExpContext = React.createContext<ExpContextValue>({
  getExperiment: constNull,
});

export interface EmpiricistProps extends React.PropsWithChildren {
  experiments: ExperimentsConfig;
}

export const Empiricist: React.FC<EmpiricistProps> = ({
  children,
  experiments,
}) => {
  const getExperiment = (id: string) => experiments[id] ?? null;

  return (
    <ExpContext.Provider value={{ getExperiment }}>
      {children}
    </ExpContext.Provider>
  );
};

export function useExperiment(id: string | null): string | null {
  const ctx = React.useContext(ExpContext);
  return ctx.getExperiment(id);
}
