import { Button, Form, Input, Rate, Result, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { feedbackReview, getReviewByID, rateReview, Review } from '../../src/services/reviews';
import { CustomResult, CustomSpinner, FullHeightContainter } from '../../src/styles/commons';
import { FeedbackContainerStyled, RatingContainerStyled } from '../../src/styles/reviews/[id]';

const { Title } = Typography;

export default function CustomerReview() {
  const router = useRouter();
  const id = router.query.id;
  const [review, setReview] = useState<Review>();

  useEffect(() => {
    async function getAndSetReview() {
      if (!id || typeof id !== 'string') {
        return;
      }
      const review = await getReviewByID(id as string);
      if (!review) {
        return;
      }
      setReview(review);
    }

    getAndSetReview();
  }, [id]);

  const RatingContainer = useMemo(() => {
    if (!review) {
      return;
    }

    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    const handleChange = async (value: any) => {
      const { rating } = value;
      const updatedReview = await rateReview(review.id, rating);
      if (!updatedReview) {
        return;
      }

      setReview(updatedReview);
    };

    return (
      <FullHeightContainter>
        <RatingContainerStyled>
          <div style={{ fontSize: '20px' }}>
            <Title level={3}>Please rate our service</Title>
            <Form onFinish={handleChange}>
              <Form.Item name="rating">
                <Rate allowHalf tooltips={desc} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </RatingContainerStyled>
      </FullHeightContainter>
    );
  }, [review]);

  const FeedbackContainer = useMemo(() => {
    if (!review) {
      return;
    }

    const handleChange = async (value: any) => {
      const { feedback } = value;

      const updatedReview = await feedbackReview(review.id, feedback);
      if (!updatedReview) {
        return;
      }

      setReview(updatedReview);
    };

    return (
      <FullHeightContainter>
        <FeedbackContainerStyled>
          <div>
            <Title level={3}>Please give us your feedback so we can make our services better</Title>
            <Form onFinish={handleChange}>
              <Form.Item name="feedback">
                <Input.TextArea placeholder="Add feedback" autoSize={{ minRows: 2, maxRows: 8 }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </FeedbackContainerStyled>
      </FullHeightContainter>
    );
  }, [review]);

  const HasGoodFeedbackContainer = useMemo(() => {
    return (
      <FullHeightContainter>
        <CustomResult
          status="success"
          title="Rated Successfully"
          subTitle="Please go to Google Play or Facebook page to rate us!"
        />
        ;
      </FullHeightContainter>
    );
  }, [review]);

  const ReviewSuccessfullyContainer = useMemo(() => {
    return (
      <FullHeightContainter>
        <CustomResult status="success" title="Review Successfully" />;
      </FullHeightContainter>
    );
  }, []);

  if (!review) {
    return (
      <FullHeightContainter>
        <CustomSpinner />;
      </FullHeightContainter>
    );
  }

  if (!review.rating) {
    return RatingContainer;
  }

  if (review.rating >= 4) {
    return HasGoodFeedbackContainer;
  }

  if (!review.is_reviewed) {
    return FeedbackContainer;
  }

  return ReviewSuccessfullyContainer;
}
