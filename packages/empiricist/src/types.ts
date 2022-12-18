export const experimentIdKey: unique symbol = Symbol('experimentId');

export interface ExperimentsConfig {
  [key: string]: string;
}

export type ExperimentalComponent<T> = React.ComponentType<T> & {
  [experimentIdKey]: string;

  /**
   * If matches the experiment value, replaces target component with the provided one
   * @param id experiment value
   * @param Component component to apply
   */
  withVariation<U>(
    id: string,
    Component: React.ComponentType<U>
  ): ExperimentalComponent<T & U>;

  /**
   * If matches the experiment value, inserts the provided component before the target component
   * @param id experiment value
   * @param Component component to apply
   */
  withSiblingBefore<U>(
    id: string,
    Component: React.ComponentType<U>
  ): ExperimentalComponent<T & U>;

  /**
   * If matches the experiment value, inserts the provided component after the target component
   * @param id experiment value
   * @param Component component to apply
   */
  withSiblingAfter<U>(
    id: string,
    Component: React.ComponentType<U>
  ): ExperimentalComponent<T & U>;

  /**
   * If matches the experiment value, wraps the target component with the provided one
   * @param id experiment value
   * @param Component component to apply
   */
  withOuterWrapper<U extends ChildrenTypeIfDefined<T>>(
    id: string,
    Component: React.ComponentType<U>
  ): ExperimentalComponent<T & U>;

  /**
   * If matches the experiment value, wraps the target component's children with the provided one
   * @param id experiment value
   * @param Component component to apply
   */
  withInnerWrapper<U extends ChildrenTypeIfDefined<T>>(
    id: string,
    Component: React.ComponentType<U>
  ): ExperimentalComponent<T & U>;
};

export type ChildrenTypeIfDefined<T, Fallback = unknown> = T extends {
  children: unknown;
}
  ? { children: T['children'] }
  : Fallback;

export type ApplyFn<T, U> = (
  id: string,
  Variant: React.ComponentType<U>
) => (Target: ExperimentalComponent<T>) => ExperimentalComponent<T & U>;
