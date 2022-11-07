import { useExperiment } from './context';
import { makeNullComponent } from './utils';
import * as React from 'react';

export interface ExperimentsConfig {
  [key: string]: string;
}

export type Experimental<T> = React.ComponentType<T> & {
  __experimentId?: string;
  withVariation<U>(
    id: string,
    Variant: React.ComponentType<U>
  ): Experimental<T & U>;
};

export function createExperiment<T>(
  id: string,
  DefaultComponent: React.ComponentType<T> = makeNullComponent()
): Experimental<T> {
  const ExperimentWrapper: Experimental<T> = (props) => (
    <DefaultComponent {...(props as T & JSX.IntrinsicAttributes)} />
  );

  ExperimentWrapper.__experimentId = id;

  ExperimentWrapper.withVariation = function withVariation<U>(
    id: string,
    Variant: React.ComponentType<U>
  ): Experimental<T & U> {
    const applyVariation = createVariation<T, U>(id, Variant);
    return applyVariation(ExperimentWrapper);
  };

  return ExperimentWrapper;
}

export function createVariation<T, U>(
  id: string,
  Variant: React.ComponentType<U>
) {
  return (Component: Experimental<T>): Experimental<T & U> => {
    if (!Object.prototype.hasOwnProperty.call(Component, '__experimentId')) {
      console.warn(`${Variant.name} is not experimental.`);
    }

    const VariationWrapper: Experimental<T & U> = (props) => {
      const variationId = useExperiment(Component.__experimentId ?? null);
      return variationId === id ? (
        <Variant {...(props as U & JSX.IntrinsicAttributes)} />
      ) : (
        <Component {...(props as T & JSX.IntrinsicAttributes)} />
      );
    };

    VariationWrapper.withVariation = function withVariation<S>(
      id: string,
      Variant: React.ComponentType<S>
    ): Experimental<T & U & S> {
      const applyVariation = createVariation<T & U, S>(id, Variant);
      return applyVariation(VariationWrapper);
    };

    VariationWrapper.__experimentId = Component.__experimentId;

    return VariationWrapper;
  };
}
