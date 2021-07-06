import styled from 'styled-components';

import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

export interface NumberKeyboardProps {
  handleClickNumber: (value: number) => void;
  isOK: boolean;
  handleOK: () => any;
  handleDelete: () => any;
}

export default function NumberKeyboard({ handleClickNumber, handleOK, isOK, handleDelete }: NumberKeyboardProps) {
  const NumberButtons: JSX.Element[] = [];

  const OKButton = (
    <OKButtonStyled onClick={handleOK} key={'ok'}>
      <Button type="primary" size="large" shape="round" disabled={!isOK} style={{ height: '100%' }}>
        Submit
      </Button>
    </OKButtonStyled>
  );

  const DeleteButton = (
    <DeleteButtonStyled onClick={handleDelete} key={'delete'}>
      <ArrowLeftOutlined />
    </DeleteButtonStyled>
  );

  for (let i = 1; i < 10; i++) {
    const NumberButton = (
      <NumberButtonStyled onClick={() => handleClickNumber(i)} key={i}>
        <NumberStyled>{i}</NumberStyled>
      </NumberButtonStyled>
    );

    // NumberButtons.push(NumberButton);

    NumberButtons.push(
      <Button type="primary" size="large" shape="round" onClick={() => handleClickNumber(i)} style={{ height: '100%' }}>
        {i}
      </Button>,
    );
  }

  NumberButtons.push(DeleteButton);

  NumberButtons.push(
    <NumberButtonStyled onClick={() => handleClickNumber(0)} key={0}>
      <NumberStyled>{0}</NumberStyled>
    </NumberButtonStyled>,
  );

  NumberButtons.push(OKButton);

  return <NumberKeyboardContainer>{NumberButtons}</NumberKeyboardContainer>;
}

const NumberKeyboardContainer = styled.div`
  /* width: 349px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 5px;
  column-gap: 5px;
  margin-bottom: 20px;

  justify-content: center; */

  width: 349px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  row-gap: 20px;
  column-gap: 40px;

  justify-items: center;
  align-items: center;
`;

const NumberButtonStyled = styled.div`
  width: 70px;
  height: 70px;
  display: flex;

  align-items: center;
  justify-content: center;
  border: 1px solid #1c6ea4;
  border-radius: 50%;

  cursor: pointer !important;
`;

const OKButtonStyled = styled.div`
  /* width: 70px; */
  height: 70px;
  display: flex;

  align-items: center;
  justify-content: center;
  border-radius: 50%;
  /* border: 1px solid #1c6ea4; */

  cursor: pointer !important;
`;

const DeleteButtonStyled = styled.div`
  width: 70px;
  height: 70px;
  display: flex;

  align-items: center;
  justify-content: center;
  border: 1px solid #1c6ea4;
  border-radius: 50%;
  font-size: 40px;

  cursor: pointer !important;
`;

const NumberStyled = styled.p`
  font-size: 1.5rem;
  margin: 0;
`;
