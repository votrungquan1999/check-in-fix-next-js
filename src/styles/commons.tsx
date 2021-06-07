import { Result, ResultProps, Spin, SpinProps } from 'antd';
import { SpinState } from 'antd/lib/spin';
import React, { ComponentProps, ReactElement } from 'react';
import styled from 'styled-components';

export const CenterContainner = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center; */

  /* & > div { */
  /* position: absolute; */
  /* padding-top: 50%; */
  /* top: 50%; */
  /* left: 50%; */
  /* } */

  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function CustomSpinner(props: SpinProps | SpinState | { children: ReactElement }) {
  return (
    <CenterContainner>
      {/* <div> */}
      <Spin {...props} size="large" />
      {/* </div> */}
    </CenterContainner>
  );
}

export function CustomResult(props: ResultProps) {
  return (
    <CenterContainner>
      {/* <div> */}
      <Result {...props} />
      {/* </div> */}
    </CenterContainner>
  );
}
