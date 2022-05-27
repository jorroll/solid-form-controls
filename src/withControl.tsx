import { Component, createMemo, createRoot, JSX, ParentProps } from 'solid-js';
import { IAbstractControl } from './abstract-control';

type WithControlProps<
  Props,
  ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl
> = ParentProps<
  Props &
    (Parameters<ControlFactory>[number] extends never
      ? {}
      : Parameters<ControlFactory>[0] extends undefined
      ? {}
      : Parameters<ControlFactory>[0])
>;

export interface IWithControlOptions<
  Props extends {},
  ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl
> {
  controlFactory: ControlFactory;
  component: Component<
    WithControlProps<Props, ControlFactory> & {
      control: ReturnType<ControlFactory>;
    }
  >;
}

export type WithControlReturnType<
  Props extends {},
  ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl
> = ((
  props: WithControlProps<Props, ControlFactory> & {
    control?: ReturnType<ControlFactory>;
  }
) => JSX.Element) & {
  buildControl: ControlFactory;
};

export function withControl<
  Props extends {},
  ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl
>(
  options: IWithControlOptions<Props, ControlFactory>
): WithControlReturnType<Props, ControlFactory> {
  const wrappedComponent: WithControlReturnType<Props, ControlFactory> = (
    props
  ) => {
    const control = createMemo(
      () =>
        props.control ||
        createRoot(
          () => options.controlFactory(props) as ReturnType<ControlFactory>
        )
    );

    const Component = options.component;

    return <Component {...props} control={control()} />;
  };

  wrappedComponent.buildControl = options.controlFactory;

  return wrappedComponent;
}
