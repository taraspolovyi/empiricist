export const experimentIdKey: unique symbol = Symbol('experimentId');

export interface ExperimentsConfig {
  [key: string]: string;
}

export type Experimental<T> = React.ComponentType<T> & {
  [experimentIdKey]?: string;

  /**
   *
   * @param id
   * @param Component
   */
  withVariation<U>(
    id: string,
    Component: React.ComponentType<U>
  ): Experimental<T & U>;

  /**
   *
   * @param id
   * @param Component
   */
  withSiblingBefore<U>(
    id: string,
    Component: React.ComponentType<U>
  ): Experimental<T & U>;

  /**
   *
   * @param id
   * @param Component
   */
  withSiblingAfter<U>(
    id: string,
    Component: React.ComponentType<U>
  ): Experimental<T & U>;

  /**
   *
   * @param id
   * @param Component
   */
  withOuterWrapper<U extends ChildrenTypeIfDefined<T>>(
    id: string,
    Component: React.ComponentType<U>
  ): Experimental<T & U>;

  /**
   *
   * @param id
   * @param Component
   */
  withInnerWrapper<U extends ChildrenTypeIfDefined<T>>(
    id: string,
    Component: React.ComponentType<U>
  ): Experimental<T & U>;
};

export type ChildrenTypeIfDefined<T, Fallback = unknown> = T extends {
  children: unknown;
}
  ? { children: T['children'] }
  : Fallback;
