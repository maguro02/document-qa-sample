'use client';
import styled from '@emotion/styled';
import { useVectorStore } from 'hooks/useVectorStore';

type ComponentProps = {
  className?: string;
};

const Component: React.FC<ComponentProps> = ({ className }) => (
  <div className={className}>
    <span className="item">test1</span>
    <span className="item">test2</span>
    <span className="item">test3</span>
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  flex-flow: column;
  width: 260px;
  height: 100vh;
  background-color: rgba(32, 33, 35);

  .item {
    padding: 10px;
    border-bottom: 1px solid #676767;
    transition: background-color 0.3s;
    cursor: pointer;

    :hover {
      background-color: #676767;
    }
  }
`;

export const SideBar: React.FC = () => {
  const stores = (async () => await fetch('/api/readVectorStore').then((res) => res.json()))(); //useVectorStore();

  console.log(stores);

  return <StyledComponent />;
};
