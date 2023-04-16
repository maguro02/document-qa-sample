'use client';
import styled from '@emotion/styled';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVectorStore } from 'hooks/useVectorStore';

type ComponentProps = {
  className?: string;
  isRoute: boolean;
  docs: string[];
};

const Component: React.FC<ComponentProps> = ({ className, isRoute, docs }) => (
  <div className={className}>
    {!isRoute && (
      <Link className="item" href="/">
        Back to Home
      </Link>
    )}
    {docs.length > 0 &&
      docs.map((doc) => (
        <Link key={doc} className="item" href={`conversation/${doc}`}>
          {doc}
        </Link>
      ))}
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
    text-decoration: none;
    cursor: pointer;

    :hover {
      background-color: #676767;
    }
  }
`;

export const SideBar: React.FC = () => {
  const [stores, reFetch] = useVectorStore();
  const pathName = usePathname();

  const isRoutePath = pathName === '/';

  return <StyledComponent docs={stores} isRoute={isRoutePath} />;
};
