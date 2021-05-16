import { CSSProperties } from 'react';
import styled from 'styled-components';

export const CreateTicketPage = styled.div`
  width: 100vw;
  height: 100vh;

  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

export const CreateTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CreateTicketInputFields = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 40px;

  .ant-form-item {
    margin-bottom: 8px;
  }

  .ant-form-item-label {
    padding: 0 0 0px;
  }
`;

export const CreateTicketColumn = styled.div`
  min-width: 300px;
`;

export const CreateTicketSuccessfullyPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  row-gap: 30px;
`;

export const SuccessIconStyles: CSSProperties = {
  fontSize: 200,
  color: 'lime',
};

export const CreateTicketSuccessfullyMessage = styled.div`
  font-size: 24px;
`;
