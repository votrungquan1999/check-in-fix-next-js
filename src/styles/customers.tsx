import { CSSProperties } from 'react';
import styled from 'styled-components';

export const phoneNumberFormStyles: CSSProperties = {
  width: 500,
};

export const phoneNumberInputPageStyles: CSSProperties = {
  width: '100vw',
  height: '100vh',

  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
};

export const customerChosingPageStyles: CSSProperties = {
  width: '100vw',
  height: '100vh',

  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
};

export const StyledCustomerChosingForm = styled.div`
  max-width: 450px;
  width: 50%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #000000;
  padding: 30px 0px;
`;

export const CustomerChosingBox = styled.div`
  width: 100%;
  justify-content: center;

  display: flex;
  flex-direction: column;
  padding: 0px 30px;

  h5.ant-typography {
    margin-bottom: 0;
  }

  :hover {
    cursor: pointer;
    background-color: rgba(28, 110, 164, 0.2);
  }
`;

export const InnerChosingBox = styled.div`
  width: 100%;
  border-bottom: 1px solid #1c6ea4;
  padding: 10px 0px;
`;
