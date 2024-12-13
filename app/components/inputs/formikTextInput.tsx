import { Label, TextInput } from 'flowbite-react';
import { useField } from 'formik';
import { ComponentProps, FC } from 'react';

interface TextInputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  icon?: FC<ComponentProps<'svg'>>;
  rightIcon?: FC<ComponentProps<'svg'>>;
}

export default function FormikTextInput({ ...props }: TextInputProps) {
  const [field, meta] = useField(props);

  return (
    <>
      {props.label && <Label htmlFor={props.name} value={props.label} className="mb-2 block" />}

      <div className="relative w-full">
        <TextInput
          color={meta.touched && meta.error ? 'failure' : 'info'}
          helperText={meta.touched && meta.error && <>{meta.error}</>}
          id={props.name}
          placeholder={props.placeholder}
          icon={props.icon}
          rightIcon={props.rightIcon}
          autoComplete={props.autoComplete}
          {...props}
          {...field}
        />
      </div>
    </>
  );
}
