import * as React from 'react';

import { useExperiment } from './context';
import { ChildrenTypeIfDefined, Experimental, experimentIdKey } from './types';
import { constNull, omit } from './utils';

/**
 *
 * @param id
 * @param DefaultComponent
 * @returns
 */
export function experiment<T>(
  id: string,
  DefaultComponent: React.ComponentType<T> = constNull
): Experimental<T> {
  const ExperimentComponent: React.FC<T> = (props) => (
    <DefaultComponent {...(props as T & JSX.IntrinsicAttributes)} />
  );
  return _makeExperimentalFrom(id, ExperimentComponent);
}

/**
 *
 * @param id
 * @param Variant
 * @returns
 */
export function applyVariation<T, U>(
  id: string,
  Variant: React.ComponentType<U>
) {
  return (Target: Experimental<T>): Experimental<T & U> => {
    _assertIsExperimental(Target);

    const VariationComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      return variationId === id ? (
        <Variant {...(props as U & JSX.IntrinsicAttributes)} />
      ) : (
        <Target {...(props as T & JSX.IntrinsicAttributes)} />
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], VariationComponent);
  };
}

/**
 *
 * @param id
 * @param Sibling
 * @returns
 */
export function applySiblingAfter<T, U>(
  id: string,
  Sibling: React.ComponentType<U>
) {
  return (Target: Experimental<T>): Experimental<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      return (
        <>
          <Target {...(props as T & JSX.IntrinsicAttributes)} />
          {variationId === id ? (
            <Sibling {...(props as U & JSX.IntrinsicAttributes)} />
          ) : null}
        </>
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], SiblingComponent);
  };
}

/**
 *
 * @param id
 * @param Sibling
 * @returns
 */
export function applySiblingBefore<T, U>(
  id: string,
  Sibling: React.ComponentType<U>
) {
  return (Target: Experimental<T>): Experimental<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      return (
        <>
          {variationId === id ? (
            <Sibling {...(props as U & JSX.IntrinsicAttributes)} />
          ) : null}
          <Target {...(props as T & JSX.IntrinsicAttributes)} />
        </>
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], SiblingComponent);
  };
}

/**
 *
 * @param id
 * @param Sibling
 * @returns
 */
export function applyOuterWrapper<T, U extends ChildrenTypeIfDefined<T>>(
  id: string,
  Sibling: React.ComponentType<U>
) {
  return (Target: Experimental<T>): Experimental<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      const innerProps = props as T & JSX.IntrinsicAttributes;
      const outerProps = omit(props, 'children') as U & JSX.IntrinsicAttributes;
      return variationId === id ? (
        <Sibling {...outerProps}>
          <Target {...innerProps} />
        </Sibling>
      ) : (
        <Target {...(props as T & JSX.IntrinsicAttributes)} />
      );
    };

    return _makeExperimentalFrom(Target[experimentIdKey], SiblingComponent);
  };
}

/**
 *
 * @param id
 * @param Sibling
 * @returns
 */
export function applyInnerWrapper<T, U extends ChildrenTypeIfDefined<T>>(
  id: string,
  Sibling: React.ComponentType<U>
) {
  return (Target: Experimental<T>): Experimental<T & U> => {
    _assertIsExperimental(Target);

    const SiblingComponent: React.FC<T & U> = (props) => {
      const variationId = useExperiment(Target[experimentIdKey] ?? null);
      const innerProps = props as U & JSX.IntrinsicAttributes;
      const outerProps = omit(props, 'children') as T & JSX.IntrinsicAttributes;
      return variationId === id ? (
        <Target {...outerProps}>
          <Sibling {...innerProps} />
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
): asserts c is Experimental<T> {
  if (!Object.prototype.hasOwnProperty.call(c, experimentIdKey)) {
    throw new Error(`${c.name} is not experimental.`);
  }
}

/**
 * Converts a component into Experimental instance by assigning an experiment ID and the required methods
 * @param experimentId
 * @param Component
 * @returns
 */
function _makeExperimentalFrom<T>(
  experimentId: string | undefined,
  Component: React.ComponentType<T>
): Experimental<T> {
  const ExpComponent = Component as Experimental<T>;

  ExpComponent[experimentIdKey] = experimentId;

  ExpComponent.withVariation = function <S>(
    id: string,
    Variant: React.ComponentType<S>
  ): Experimental<T & S> {
    const applyTo = applyVariation<T, S>(id, Variant);
    return applyTo(ExpComponent);
  };

  ExpComponent.withSiblingBefore = function <S>(
    id: string,
    Variant: React.ComponentType<S>
  ): Experimental<T & S> {
    const applyTo = applySiblingBefore<T, S>(id, Variant);
    return applyTo(ExpComponent);
  };

  ExpComponent.withSiblingAfter = function <S>(
    id: string,
    Variant: React.ComponentType<S>
  ): Experimental<T & S> {
    const applyTo = applySiblingAfter<T, S>(id, Variant);
    return applyTo(ExpComponent);
  };

  ExpComponent.withOuterWrapper = function <S extends ChildrenTypeIfDefined<T>>(
    id: string,
    Variant: React.ComponentType<S>
  ): Experimental<T & S> {
    const applyTo = applyOuterWrapper<T, S>(id, Variant);
    return applyTo(ExpComponent);
  };

  ExpComponent.withInnerWrapper = function <S extends ChildrenTypeIfDefined<T>>(
    id: string,
    Variant: React.ComponentType<S>
  ): Experimental<T & S> {
    const applyTo = applyInnerWrapper<T, S>(id, Variant);
    return applyTo(ExpComponent);
  };

  return ExpComponent;
}
