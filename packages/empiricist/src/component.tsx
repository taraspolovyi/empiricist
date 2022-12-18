import * as React from 'react';

import { useExperiment } from './context';
import {
  ApplyFn,
  ChildrenTypeIfDefined,
  ExperimentalComponent,
  experimentIdKey,
} from './types';
import { constNull, omit } from './utils';

/**
 * Converts a React component to experimental component
 * @param id identifier of the experiment
 * @param DefaultComponent component that needs to be converted
 * @returns a converted component with the assigned experiment
 */
export function experiment<T>(
  id: string,
  DefaultComponent: React.ComponentType<T> = constNull
): ExperimentalComponent<T> {
  const ExperimentComponent: React.FC<T> = (props) => (
    <DefaultComponent {...(props as T & JSX.IntrinsicAttributes)} />
  );
  return _makeExperimentalFrom(id, ExperimentComponent);
}

/**
 * If matches the experiment value, replaces target component with the provided one
 * @param id experiment value
 * @param Component component to apply
 */
export function applyVariation<T, U>(
  id: string,
  Component: React.ComponentType<U>
) {
  return (Target: ExperimentalComponent<T>): ExperimentalComponent<T & U> => {
    _assertIsExperimental(Target);

    const VariationComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      return variationId === id ? (
        <Component {...(props as U & JSX.IntrinsicAttributes)} />
      ) : (
        <Target {...(props as T & JSX.IntrinsicAttributes)} />
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], VariationComponent);
  };
}

/**
 * If matches the experiment value, inserts the provided component after the target component
 * @param id experiment value
 * @param Component component to apply
 */
export function applySiblingAfter<T, U>(
  id: string,
  Component: React.ComponentType<U>
) {
  return (Target: ExperimentalComponent<T>): ExperimentalComponent<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      return (
        <>
          <Target {...(props as T & JSX.IntrinsicAttributes)} />
          {variationId === id ? (
            <Component {...(props as U & JSX.IntrinsicAttributes)} />
          ) : null}
        </>
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], SiblingComponent);
  };
}

/**
 * If matches the experiment value, inserts the provided component before the target component
 * @param id experiment value
 * @param Component component to apply
 */
export function applySiblingBefore<T, U>(
  id: string,
  Component: React.ComponentType<U>
) {
  return (Target: ExperimentalComponent<T>): ExperimentalComponent<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      return (
        <>
          {variationId === id ? (
            <Component {...(props as U & JSX.IntrinsicAttributes)} />
          ) : null}
          <Target {...(props as T & JSX.IntrinsicAttributes)} />
        </>
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], SiblingComponent);
  };
}

/**
 * If matches the experiment value, wraps the target component with the provided one
 * @param id experiment value
 * @param Component component to apply
 */
export function applyOuterWrapper<T, U extends ChildrenTypeIfDefined<T>>(
  id: string,
  Component: React.ComponentType<U>
) {
  return (Target: ExperimentalComponent<T>): ExperimentalComponent<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      const innerProps = props as T & JSX.IntrinsicAttributes;
      const outerProps = omit(props, 'children') as U & JSX.IntrinsicAttributes;
      return variationId === id ? (
        <Component {...outerProps}>
          <Target {...innerProps} />
        </Component>
      ) : (
        <Target {...(props as T & JSX.IntrinsicAttributes)} />
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], SiblingComponent);
  };
}

/**
 * If matches the experiment value, wraps the target component's children with the provided one
 * @param id experiment value
 * @param Component component to apply
 * @returns
 */
export function applyInnerWrapper<T, U extends ChildrenTypeIfDefined<T>>(
  id: string,
  Component: React.ComponentType<U>
) {
  return (Target: ExperimentalComponent<T>): ExperimentalComponent<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      const innerProps = props as U & JSX.IntrinsicAttributes;
      const outerProps = omit(props, 'children') as T & JSX.IntrinsicAttributes;
      return variationId === id ? (
        <Target {...outerProps}>
          <Component {...innerProps} />
        </Target>
      ) : (
        <Target {...(props as T & JSX.IntrinsicAttributes)} />
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], SiblingComponent);
  };
}

function _assertIsExperimental<T>(
  c: React.ComponentType<T>
): asserts c is ExperimentalComponent<T> {
  if (!Object.prototype.hasOwnProperty.call(c, experimentIdKey)) {
    throw new Error(`${c.name} is not experimental.`);
  }
}

/**
 * Converts a component into Experimental instance by assigning an experiment ID and the required methods
 * @param experimentId identifier of the experiment
 * @param Component component that needs to be converted to ExperimentalComponent
 * @returns a resulting ExperimentalComponent
 */
function _makeExperimentalFrom<T>(
  experimentId: string,
  Component: React.ComponentType<T>
): ExperimentalComponent<T> {
  const ExpComponent = Component as ExperimentalComponent<T>;

  ExpComponent[experimentIdKey] = experimentId;

  ExpComponent.withVariation = _bindTo(ExpComponent, applyVariation);
  ExpComponent.withSiblingBefore = _bindTo(ExpComponent, applySiblingBefore);
  ExpComponent.withSiblingAfter = _bindTo(ExpComponent, applySiblingAfter);
  ExpComponent.withOuterWrapper = _bindTo(ExpComponent, applyOuterWrapper);
  ExpComponent.withInnerWrapper = _bindTo(ExpComponent, applyInnerWrapper);

  return ExpComponent;
}

/**
 * Binds experiment functions to given ExperimentalComponent
 * @param ExpComponent ExperimentalComponent function to be bound to
 * @param applyFn function that needs to be bound
 * @returns a function bound to the provided ExperimentalComponent
 */
function _bindTo<T, U>(
  ExpComponent: ExperimentalComponent<T>,
  applyFn: ApplyFn<T, U>
) {
  return (id: string, Variant: React.ComponentType<U>) => {
    const applyTo = applyFn(id, Variant);
    return applyTo(ExpComponent);
  };
}
