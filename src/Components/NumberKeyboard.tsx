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
      <Button type="primary" size="large" disabled={!isOK} style={{ width: '100%', height: '100%' }}>
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

    NumberButtons.push(NumberButton);
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
  width: 349px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 5px;
  column-gap: 5px;
  margin-bottom: 20px;

  justify-content: center;
`;

const NumberButtonStyled = styled.div`
  width: 113px;
  height: 70px;
  display: flex;

  align-items: center;
  justify-content: center;
  border: 1px solid #1c6ea4;

  cursor: pointer !important;
`;

const OKButtonStyled = styled.div`
  width: 113px;
  height: 70px;
  display: flex;

  align-items: center;
  justify-content: center;
  /* border: 1px solid #1c6ea4; */

  cursor: pointer !important;
`;

const DeleteButtonStyled = styled.div`
  width: 113px;
  height: 70px;
  display: flex;

  align-items: center;
  justify-content: center;
  border: 1px solid #1c6ea4;
  font-size: 60px;

  cursor: pointer !important;
`;

const NumberStyled = styled.p`
  font-size: 24px;
  margin: 0;
`;
