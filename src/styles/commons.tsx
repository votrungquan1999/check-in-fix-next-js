import { Result, ResultProps, Spin, SpinProps } from 'antd';
import { SpinState } from 'antd/lib/spin';
import React, { ComponentProps, ReactElement } from 'react';
import styled from 'styled-components';

export const CenterContainner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FullHeightContainter = styled.div`
  height: 100vh;
`;

export function CustomSpinner(props: SpinProps | SpinState | { children: ReactElement }) {
  return (
    <CenterContainner>
      <Spin {...props} size="large" />
    </CenterContainner>
  );
}

export function CustomResult(props: ResultProps) {
  return (
    <CenterContainner>
      <Result {...props} />
    </CenterContainner>
  );
}
