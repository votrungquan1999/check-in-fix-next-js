import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

export const SpinningContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    position: absolute;
    /* padding-top: 50%; */
    top: 50%;
    /* left: 50%; */
  }
`;

export function CustomSpinner() {
  return (
    <SpinningContainer>
      <div>
        <Spin size="large" />
      </div>
    </SpinningContainer>
  );
}
