import { TextInputProps } from '@mantine/core';
import TextInput from './TextInput.tsx';

interface AssignToVariableInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function AssignToVariableInput({ value, onChange, ...props }: AssignToVariableInputProps) {
  return (
    <TextInput {...props} value={value ?? ''} onChange={(e) => onChange(e.currentTarget.value.toUpperCase() || null)} />
  );
}
