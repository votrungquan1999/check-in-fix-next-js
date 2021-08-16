import styled from 'styled-components';

export const CreateCustomerPageStyled = styled.div`
  width: 70vw;
`;

export const CreateCustomerFormStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

export const CreateCustomerInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 40px;
`;

export const CreateCustomerColumn = styled.div`
  min-width: 300px;
  margin-top: auto;
  /* margin-right: 40px; */
`;
