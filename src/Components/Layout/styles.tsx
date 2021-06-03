import styled, { CSSProperties } from 'styled-components';

export const StoreNameContainer = styled.div`
  font-size: 20px;
  color: white;
  cursor: pointer;
`;

export const MainContainerStyles: CSSProperties = {
  width: '100vw',
  height: '100vh',
};

export const MainContainerContentstyles: CSSProperties = {
  padding: 24,
  margin: 0,
  minHeight: 'calc(100vh-64px)',
};

export const MainContainerSiderMenuStyled = styled.div`
  .ant-menu-item {
    margin-top: 0 !important;
    margin-bottom: 10px;
  }
`;

export const PageNameStyled = styled.div`
  font-size: 20px;
  color: white;
  cursor: pointer;
  position: absolute;
  left: calc(50vw);
`;

export const MainContainerHeaderStyles: CSSProperties = {
  display: 'flex',
  position: 'fixed',
  zIndex: 1,
  width: '100%',
};

export const MainContainerSiderStyles: CSSProperties = {
  overflow: 'auto',
  height: 'calc(100vh - 64px)',
  position: 'fixed',
  left: 0,
  top: 64,
};

export const HeaderUserLogout = styled.div`
  position: absolute;
  right: 50px;
`;

export const TableContainerStyled = styled.div`
  /* padding: 0 20px; */
`;

export const CustomerTableHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;
