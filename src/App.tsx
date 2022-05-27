import { render } from 'solid-js/web';
import {
  createSignal,
  createEffect,
  createMemo,
  mergeProps,
  observable,
  Show,
  createRenderEffect,
  untrack,
  For,
  createRoot,
  getOwner,
  runWithOwner,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { from } from 'rxjs';
import { createFormControl } from './form-control';
import { createFormGroup, IFormGroup } from './form-group';
import { withControl } from './withControl';
import { createFormArray } from './form-array';
import { bindOwner } from './util';

export default function FormArray() {
  const array = createFormArray([AddressForm.buildControl()]);

  const addAddress = bindOwner(() =>
    array.setControls([AddressForm.buildControl()])
  );

  const controls = () => array.controls;

  return (
    <div>
      <button onclick={addAddress}>Hello</button>

      <For each={controls()}>{(item) => <AddressForm control={item} />}</For>

      <div>{JSON.stringify(array.value)}</div>
    </div>
  );
}

const AddressForm = withControl({
  controlFactory: () =>
    createFormGroup(
      {
        street: TextInput.buildControl(),
        city: TextInput.buildControl(),
        state: TextInput.buildControl(),
        zip: TextInput.buildControl(),
      },
      {
        data: { label: 'Your address' },
      }
    ),
  component: (props) => {
    const group = () => props.control;
    const controls = () => props.control.controls;

    return (
      <fieldset disabled={group().isDisabled}>
        <legend>{group().data.label}</legend>

        <TextInput control={controls().street} />
        <TextInput control={controls().city} />
        <TextInput control={controls().state} />
        <TextInput control={controls().zip} />
      </fieldset>
    );
  },
});

const TextInput = withControl({
  controlFactory: (p?: {
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
  }) => {
    return createFormControl('');
  },
  component: (props) => {
    const control = () => props.control;

    createRenderEffect(() => {
      if (props.disabled === undefined) return;
      if (props.disabled === untrack(() => control().isDisabled)) return;

      control().markDisabled(props.disabled);
    });

    createRenderEffect(() => {
      if (props.readonly === undefined) return;
      if (props.readonly === untrack(() => control().isReadonly)) return;

      control().markReadonly(props.readonly);
    });

    createRenderEffect(() => {
      if (props.required === undefined) return;
      if (props.required === untrack(() => control().isRequired)) return;

      control().markRequired(props.required);
    });

    return (
      <>
        <input
          type="text"
          value={control().value}
          oninput={(e) => control().setValue(e.currentTarget.value)}
          onblur={() => control().markTouched(true)}
          disabled={control().isDisabled}
          readonly={control().isReadonly}
          required={control().isRequired}
        />

        <Show when={!control().isValid && control().isTouched}>
          {control().errors?.required && (
            <small>Oops! An answer is required</small>
          )}

          {control().errors?.uppercase && (
            <small>Oops! Must be uppercase.</small>
          )}
        </Show>
      </>
    );
  },
});
