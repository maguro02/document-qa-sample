import React, { useState } from 'react';

type TextareaProps = { onSubmit?: (value: string) => void } & Omit<React.ComponentProps<'textarea'>, 'onSubmit'>;

export const Textarea: React.FC<TextareaProps> = ({ className, onSubmit, ...props }) => {
  const [value, setValue] = useState('');
  const [row, setRow] = useState<number>(1);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    updateRow(event.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey) {
      return;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit && onSubmit(value);
      setValue('');
      updateRow('');
    }
  };

  const updateRow = (value: string) => {
    const row = value.split('\n').length;
    setRow(row);
  };

  return (
    <textarea
      className={className}
      value={value}
      rows={row}
      onChange={handleChange}
      onKeyDown={handleOnKeyDown}
      {...props}
    />
  );
};
