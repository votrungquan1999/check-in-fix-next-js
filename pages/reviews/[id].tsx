import Icon, { ConsoleSqlOutlined, FacebookFilled, FacebookOutlined, GoogleCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, Rate, Result, Typography } from 'antd';
import { find, flow, get, isEqual } from 'lodash/fp';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleIcon } from '../../src/Components/Icons/GoogleIcon';
import { WithAuthProps } from '../../src/firebase/withAuth';
import { getRatingPlatformByReviewID, RatingPlatforms } from '../../src/services/settings/ratingPlatforms';
import { feedbackReview, getReviewByID, rateReview, Review } from '../../src/services/reviews';
import { CustomResult, CustomSpinner, FullHeightContainer } from '../../src/styles/commons';
import {
  FeedbackContainerStyled,
  RatingContainerStyled,
  ReviewOnPlatformButtonStyled,
} from '../../src/styles/reviews/[id]';
// import googleIconSVG from '../../src/assets/images/icons/Google_Logo.svg';

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
      <div className="h-screen">
        <RatingContainerStyled className="h-full flex flex-col items-center content-center">
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
        </RatingContainerStyled>
      </div>
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
      <FullHeightContainer>
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
      </FullHeightContainer>
    );
  }, [review]);

  const ReviewSuccessfullyContainer = useMemo(() => {
    return (
      <FullHeightContainer>
        <CustomResult status="success" title="Review Successfully" />;
      </FullHeightContainer>
    );
  }, []);

  if (!review) {
    return (
      <div className="h-screen">
        <CustomSpinner />;
      </div>
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
  const router = useRouter();

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
  }, [reviewID, setRatingPlatforms, getRatingPlatformByReviewID]);

  const ratingPlatformLinks = useMemo(() => {
    if (!ratingPlatforms || !ratingPlatforms.length) {
      return;
    }

    const facebookPlatform = find<RatingPlatforms>(flow(get('name'), isEqual('facebook')))(ratingPlatforms);

    const reviewOnFacebookButton = facebookPlatform ? (
      <ReviewOnPlatformButtonStyled
        href={facebookPlatform.url}
        target="_blank"
        // type="primary"
        icon={<FacebookFilled color="#1890ff" />}
      >
        Review us on Facebook
      </ReviewOnPlatformButtonStyled>
    ) : undefined;

    const googlePlatform = find<RatingPlatforms>(flow(get('name'), isEqual('google')))(ratingPlatforms);

    const reviewOnGoogleButton = googlePlatform ? (
      <ReviewOnPlatformButtonStyled
        href={googlePlatform.url}
        target="_blank"
        // type="primary"
        icon={<Icon component={GoogleIcon} />}
      >
        Review us on Google
      </ReviewOnPlatformButtonStyled>
    ) : undefined;

    return (
      <div className="flex flex-col gap-y-7">
        {reviewOnGoogleButton}
        {reviewOnFacebookButton}
      </div>
    );
  }, [ratingPlatforms]);

  const successMessage = useMemo(() => {
    return (
      <div className="border p-2 w-96">
        <div>
          <p className="m-0 font-black text-2xl">"</p>
          <p className="m-0">
            We want to be better, and your feedback helps us accomplish that. Please help us know how you feel about
            your visit.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="m-0"> Thanks for your trust!</p>
          <p className="m-0 font-black text-2xl">“</p>
        </div>
      </div>
    );
  }, []);

  const reviewRequest = useMemo(() => {
    return <div className="flex justify-center">PLEASE GIVE US A REVIEW</div>;
  }, []);

  if (!ratingPlatforms) {
    return (
      <div className="h-screen">
        <CustomSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {/* <div>
        <CustomResult status="success" title="Review Successfully" />
      </div> */}
      <div className="w-min flex flex-col items-center gap-y-4">
        {successMessage}
        {reviewRequest}
        {ratingPlatformLinks}
      </div>
    </div>
  );
}
