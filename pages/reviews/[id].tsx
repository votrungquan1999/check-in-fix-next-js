import { ConsoleSqlOutlined } from '@ant-design/icons';
import { Button, Form, Input, Rate, Result, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../src/firebase/withAuth';
import { getRatingPlatformByReviewID, RatingPlatforms } from '../../src/services/ratingPlatforms';
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

  // const HasGoodFeedbackContainer = useMemo(() => {
  //   return (
  //     <FullHeightContainter>
  //       <CustomResult
  //         status="success"
  //         title="Rated Successfully"
  //         subTitle="Please go to Google Play or Facebook page to rate us!"
  //       />
  //       ;
  //     </FullHeightContainter>
  //   );
  // }, [review]);

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
    return <HasGoodFeedbackContainer reviewID={review.id} />;
  }

  if (!review.is_reviewed) {
    return FeedbackContainer;
  }

  return ReviewSuccessfullyContainer;
}

interface HasGoodFeedbackContainerProps {
  reviewID: string;
}
function HasGoodFeedbackContainer(props: HasGoodFeedbackContainerProps) {
  const { reviewID } = props;
  const [ratingPlatforms, setRatingPlatforms] = useState<RatingPlatforms[]>();

  useEffect(() => {
    async function getRatingPlatforms() {
      if (!reviewID) {
        return;
      }

      const ratingPlatformsList = await getRatingPlatformByReviewID(reviewID);
      if (!ratingPlatformsList) {
        return;
      }

      setRatingPlatforms(ratingPlatformsList);
    }

    getRatingPlatforms();
  }, [reviewID]);

  const ratingPlatformLinks = useMemo(() => {
    if (!ratingPlatforms) {
      return;
    }

    // const editedRatingPLatform = [...ratingPlatforms, ...ratingPlatforms];

    const ratingPlatformComponents = ratingPlatforms.map((platform, index) => {
      return (
        <div className="flex flex-row mr-0.5">
          <div className="mr-0.5">
            <a href={platform.url} target="_blank">{`${platform.name}`}</a>
          </div>
          <div>{index === ratingPlatforms.length - 1 ? <p /> : <p> or </p>}</div>
        </div>
      );
    });

    return (
      <div className="inline-block">
        <div className="flex flex-row">{ratingPlatformComponents}</div>
      </div>
    );
  }, [ratingPlatforms]);

  const subTitle = useMemo(() => {
    if (!ratingPlatformLinks) {
      return;
    }

    return <div>Please go to {ratingPlatformLinks}to rate us!</div>;
  }, [ratingPlatformLinks]);

  console.log(ratingPlatforms);
  if (!ratingPlatforms) {
    return (
      <div className="h-screen">
        <CustomSpinner />
      </div>
    );
  }

  console.log('get here');

  return (
    <div className="h-screen">
      <CustomResult status="success" title="Rated Successfully" subTitle={subTitle} />;
    </div>
  );
}
