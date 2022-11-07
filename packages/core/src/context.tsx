import { ExperimentsConfig } from './core';
import { constNull } from './utils';
import * as React from 'react';

export interface ExpContextValue {
  getExperiment(id: string | null): string | null;
}

export const ExpContext = React.createContext<ExpContextValue>({
  getExperiment: constNull,
});

export interface ExperimentallyProps extends React.PropsWithChildren {
  experiments: ExperimentsConfig;
}

export const Experimentally: React.FC<ExperimentallyProps> = ({
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
