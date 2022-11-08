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
  const ExperimentComponent: React.FC<T> = (props) => (
    <DefaultComponent {...(props as T & JSX.IntrinsicAttributes)} />
  );
  return _makeExperimentalFrom(id, ExperimentComponent);
}

export function createVariation<T, U>(
  id: string,
  Variant: React.ComponentType<U>
) {
  return (Component: Experimental<T>): Experimental<T & U> => {
    if (!Object.prototype.hasOwnProperty.call(Component, '__experimentId')) {
      console.warn(`${Variant.name} is not experimental.`);
    }

    const VariationComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Component.__experimentId ?? null);
      return variationId === id ? (
        <Variant {...(props as U & JSX.IntrinsicAttributes)} />
      ) : (
        <Component {...(props as T & JSX.IntrinsicAttributes)} />
      );
    };

    return _makeExperimentalFrom(Component.__experimentId, VariationComponent);
  };
}

function _makeExperimentalFrom<T>(
  experimentId: string | undefined,
  Component: React.ComponentType<T>
): Experimental<T> {
  const ExpComponent = Component as Experimental<T>;
  ExpComponent.__experimentId = experimentId;
  ExpComponent.withVariation = function withVariation<S>(
    id: string,
    Variant: React.ComponentType<S>
  ): Experimental<T & S> {
    const applyVariation = createVariation<T, S>(id, Variant);
    return applyVariation(ExpComponent);
  };
  return ExpComponent;
}
