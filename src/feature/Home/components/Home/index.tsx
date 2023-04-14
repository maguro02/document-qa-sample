'use client';
import styled from '@emotion/styled';

type ComponentProps = {
  className?: string;
};

const Component: React.FC<ComponentProps> = ({ className }) => (
  <div className={className}>
    <div className="container">
      <h2 className="title">Document QA</h2>
      <div className="upload">ドキュメントをアップロード</div>
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgb(52, 53, 65);

  .container {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .upload {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 50px;
      font-size: 14px;
      border-radius: 5px;
      background-color: rgb(32, 33, 35, 0.6);
      cursor: pointer;
      transition: background-color 0.3s;

      :hover {
        background-color: rgb(32, 33, 35, 0.8);
      }
    }
  }
`;

export const Home: React.FC = () => {
  return <StyledComponent />;
};
