import React, { useEffect, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { getReviewList, Review } from '../../services/reviews';
import { MainContainerLoadingStyled } from '../../styles/commons';
import { ReviewTable } from '../ReviewTable';

interface ReviewProps extends WithAuthProps {}

export function ReviewPage(props: ReviewProps) {
  const { user, employee } = props;

  const [reviews, setReviews] = useState<Review[]>();

  useEffect(() => {
    async function getAndSetReviews() {
      const { token } = await user.getIdTokenResult();

      const reviewList = await getReviewList(employee.subscriber_id, token);

      setReviews(reviewList);
    }

    getAndSetReviews();
  }, []);

  return reviews ? <ReviewTable reviews={reviews} /> : <MainContainerLoadingStyled />;
}
