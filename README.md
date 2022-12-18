# Empiricist

![tree shaking is supported](https://badgen.net/bundlephobia/tree-shaking/empiricist) ![minimized size](https://badgen.net/bundlephobia/min/empiricist) ![minimized+gzip size](https://badgen.net/bundlephobia/minzip/empiricist)

Empiricist is a utility library for organizing conditional rendering of experimental React components (for A/B testing or gradual releases) in a declarative way that would not affect the components structure, but instead allows to "patch" the components tree in a minimalistic manner.

## Usage

The package is can be installed from NPM using following command

```bash
npm install empiricist

# or if you use yarn

yarn add empiricist
```

When ready, we'll need to provide the active experiments to the Empiricist using the provider component:

```jsx
import { Empiricist } from 'empiricist'

function App() {
  // some code here
  return (
    <Empiricist experiments={currentExperiments}>
      /* your components go here */
    </Empiricist>
  )
}
```

The `currentExperiments` is a simple dictionary `{ [key: string]: string }`, that specifies the current experiments configuration.

Once that is done, you can use the `experiment()` function in places where components need to be rendered conditionally based on experiment value.

```jsx
export const Example = experiment('example', DefaultExample)
  .withVariation('foo', MaybeBetterExample)
  .withVariation('bar', DifferentBetterExample)
```

If in the `experiments` object property `example` equals `"foo"`, the `MaybeBetterExample` will be rendered. If it equals `"bar"`, then `DifferentBetterExample` is rendered. In all other cases the default component is used.

Also, `Example` component now has props defined as intersection type of `MaybeBetterExample` and `DifferentBetterExample` props, which enables type safety if you're using TypeScript. 


## API Reference

### experiment

```ts
experiment(id: string, DefaultComponent?: React.ComponentType);
```

The function that is used to make the component experimental. If default component is not provided, "Null Component" will be used instead (i.e. nothing is rendered in default case).

#### withVariation

```ts
withVariation(id: string, VariationComponent: React.ComponentType);
```

The method can be used if there is a need to render one component instead of another.

#### withSiblingBefore

```ts
withSiblingBefore(id: string, SiblingComponent: React.ComponentType);
```

Unlike, the previous one, the method keeps the default component and, if the provided id matches the experiment value, renders the "sibling" right before the target component.

#### withSiblingAfter

```ts
withSiblingAfter(id: string, SiblingComponent: React.ComponentType);
```

Is similar to [withSiblingBefore](#withSiblingBefore) but the "sibling" is added after the target component.

#### withInnerWrapper

```ts
withInnerWrapper(id: string, SiblingComponent: React.ComponentType);
```

Allows to optionally wrap the target component's children with the provided component.

#### withOuterWrapper

```ts
withOuterWrapper(id: string, SiblingComponent: React.ComponentType);
```

Allows to optionally wrap the target component itself with the provided component.

### FP Style API

Also, the library exports the unbound methods that can be applied to the experiment later.

- applyVariation
- applySiblingBefore
- applySiblingAfter
- applyInnerWrapper
- applyOuterWrapper

It might be useful, when is used in FP-like pipe functions.

```ts
import { pipe } from 'fp-ts/function'

export const Greeting = pipe(
  experiment('greeting', DefaultGreeting),
  applyVariation('formal', FormalGreeting),
  applyVariation(
    'informal',
    pipe(
      experiment('emoji', InformalGreeting),
      applySiblingAfter('true', WavingHand)
    )
  )
);
```

## Contribution

This project is a quick weekend POC, so it may not be stable enough to be used in production. But if you find any bugs or have  improvements ideas, feel free to create issue or open a PR.
