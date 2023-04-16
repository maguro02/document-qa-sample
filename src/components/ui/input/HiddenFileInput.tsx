import React, { forwardRef } from 'react';
import styled from '@emotion/styled';

type Props = {
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FileDialogInput = forwardRef<HTMLInputElement, Props>(({ accept, onChange }, ref) => {
  return <HiddenInput ref={ref} type="file" accept={accept} onChange={onChange} />;
});

const HiddenInput = styled.input`
  display: none;
`;
