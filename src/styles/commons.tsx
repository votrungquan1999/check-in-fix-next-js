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

export const MainContainerFullHeightStyled = styled.div`
  height: calc(100vh - 104px);
`;

export function MainContainerLoadingStyled() {
  const LoadingContainer = styled.div`
    height: calc(100vh - 104px);
  `;

  return (
    <LoadingContainer>
      <CustomSpinner />
    </LoadingContainer>
  );
}

export const FullHeightContainer = styled.div`
  height: 100vh;
`;

export function CustomSpinner(props: SpinProps | SpinState | { children: ReactElement }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Spin {...props} size="large" />
    </div>
  );
}

export function CustomResult(props: ResultProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <Result {...props} />
    </div>
  );
}

export const ResponsiveFormStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  column-gap: 20px;

  width: 100%;
`;
