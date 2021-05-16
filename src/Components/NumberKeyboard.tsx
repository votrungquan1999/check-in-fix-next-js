import styled from 'styled-components';

export interface NumberKeyboardProps {
  handleClickNumber: (value: number) => void;
}

export default function NumberKeyboard({ handleClickNumber }: NumberKeyboardProps) {
  const NumberButtons: JSX.Element[] = [];

  for (let i = 1; i < 10; i++) {
    const NumberButton = (
      <NumberButtonStyled onClick={() => handleClickNumber(i)} key={i}>
        <NumberStyled>{i}</NumberStyled>
      </NumberButtonStyled>
    );

    NumberButtons.push(NumberButton);
  }

  NumberButtons.push(
    <NumberButtonStyled onClick={() => handleClickNumber(0)} key={0}>
      <NumberStyled>{0}</NumberStyled>
    </NumberButtonStyled>,
  );

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

const NumberStyled = styled.p`
  font-size: 24px;
  margin: 0;
`;
