import { Button } from 'antd';
import styled from 'styled-components';

export const FeedbackContainerStyled = styled.div`
  height: 100%;
  margin: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  justify-content: center;
`;

export const RatingContainerStyled = styled.div`
  .ant-rate {
    font-size: 40px;
  }
`;

export const ReviewOnPlatformButtonStyled = styled(Button)`
  font-size: 20px;
  font-weight: 700;
  height: max-content;
  padding: 4px 8px !important;

  display: flex;
  align-items: center;
  color: #1890ff;

  .anticon {
    font-size: 50px;
    line-height: 0;
  }
`;
