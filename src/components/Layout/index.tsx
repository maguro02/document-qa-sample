'use client';
import styled from '@emotion/styled';

type ComponentProps = {
  className?: string;
  children?: React.ReactNode;
};

const Component: React.FC<ComponentProps> = ({ className, children }) => <div className={className}>{children}</div>;

const StyledComponent = styled(Component)`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <StyledComponent>{children}</StyledComponent>;
};
