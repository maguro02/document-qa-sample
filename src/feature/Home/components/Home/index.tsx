'use client';
import styled from '@emotion/styled';
import { FileDialogInput } from 'components/ui/input/HiddenFileInput';
import { useRef } from 'react';

type ComponentProps = {
  className?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onUploadButtonClick: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Component: React.FC<ComponentProps> = ({ className, inputRef, onUploadButtonClick, onInputChange }) => (
  <div className={className}>
    <div className="container">
      <h2 className="title">Document QA</h2>
      <button className="upload" onClick={onUploadButtonClick}>
        ドキュメントをアップロード
      </button>
      <FileDialogInput ref={inputRef} accept="pdf" onChange={onInputChange} />
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();

    const files = e.target.files;

    if (files) {
      formData.append('file', files[0]);

      const uploadResponse = await fetch('/api/uploadDocument', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error(uploadResponse);
        return;
      }

      const uploadResponseJson = await uploadResponse.text();

      console.log(uploadResponseJson);
    }
  };

  return <StyledComponent inputRef={inputRef} onUploadButtonClick={handleUpload} onInputChange={handleInputChange} />;
};
