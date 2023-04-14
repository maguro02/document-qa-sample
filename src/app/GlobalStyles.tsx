'use client';

import { Global, css } from '@emotion/react';

const GlobalStyle = () => {
  return (
    <Global
      styles={css`
        body {
          overflow: hidden;
        }
        * {
          box-sizing: border-box;
          outline: none;
          margin: 0;
          padding: 0;
          color: white;
        }
        #__next {
          width: 100vw;
          height: 100vh;
          background: #262b36;
        }
      `}
    />
  );
};

export default GlobalStyle;
