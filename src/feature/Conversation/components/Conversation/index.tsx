'use client';
import styled from '@emotion/styled';
import { Textarea } from 'components/Textarea';
import { useState } from 'react';

type ComponentProps = {
  className?: string;
  file: string;
  history: {
    [key: string]: string;
  }[];
  onSubmit: (value: string) => void;
};

type ConversationProps = {
  file: string;
};

type ConversationResultType = {
  sourceDocuments: {
    metadata: {
      loc: { pageNumber: number };
      pdf: {
        version: string;
        info: { Producer: string; Creator: string; CreationDate: string };
        metadata: { Producer: string; Creator: string; CreationDate: string };
        totalPages: number;
      };
      source: string;
    };
  }[];
  text: string;
};

const Component: React.FC<ComponentProps> = ({ className, file, history, onSubmit }) => (
  <div className={className}>
    <h3>{file}</h3>
    <div className="log-container">
      {history.map((item, index) => (
        <div className="output-container" key={index}>
          <p className="user-input">{item.user}</p>
          <p className="ai-output">{item.ai}</p>
        </div>
      ))}
    </div>
    <div className="input-container">
      <div className="wrapper">
        <Textarea placeholder="Send message" onSubmit={onSubmit} />
      </div>
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-bottom: 50px;

  h3 {
    padding: 12px;
  }

  .log-container {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    padding: 12px;
    overflow: auto;

    .output-container {
      display: flex;
      flex-flow: column;
      width: 100%;
      height: 100%;
      padding: 12px;
      border-radius: 5px;
      background-color: rgb(32, 33, 35, 0.6);

      .user-input {
        margin-bottom: 12px;
      }

      .ai-output {
        margin-top: 12px;
      }
    }
  }

  .input-container {
    display: flex;
    width: 80%;
    height: 100%;
    flex: 1 1 0%;
    padding: 12px;
    border-radius: 5px;
    background-color: rgb(32, 33, 35, 0.6);

    .wrapper {
      display: flex;
      flex-flow: column;
      flex-grow: 1;
      width: 100%;

      textarea {
        width: 100%;
        max-height: 200px;
        /* height: 24px; */
        resize: none;
        overflow-y: auto;
      }
    }
  }
`;

export const Conversation: React.FC<ConversationProps> = ({ file }) => {
  const [conversation, setConversation] = useState<{ [key: string]: string }[]>([]);

  const handleSubmit = async (value: string) => {
    const conversationResponse = await fetch('http://localhost:3000/api/conversation', {
      method: 'POST',
      body: JSON.stringify({
        query: value,
        vectorStoreName: file,
      }),
    });

    if (!conversationResponse.ok) return;

    const result: ConversationResultType = await conversationResponse.json();

    setConversation((prev) => [
      ...prev,
      {
        ai: `${result.text}\n${result.sourceDocuments.reduce<string>((text, source) => {
          return (text += ` p${source.metadata.loc.pageNumber}`);
        }, '参照元:')}`,
        user: value,
      },
    ]);
  };

  return <StyledComponent file={file} onSubmit={handleSubmit} history={conversation} />;
};
