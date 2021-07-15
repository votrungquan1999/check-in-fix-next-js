import { isNil } from 'lodash/fp';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { getRatingPlatformsBySubscriberID, RatingPlatforms } from '../../services/settings/ratingPlatforms';
import { MainContainerLoadingStyled } from '../../styles/commons';
import { RatingPlatformSetting } from '../RatingPlatformSetting';

export function Settings(props: WithAuthProps) {
  const { employee, user } = props;
  const [ratingPlatforms, setRatingPlatforms] = useState<RatingPlatforms[]>();

  useEffect(() => {
    const getAndSetRatingPlatform = async () => {
      const { token } = await user.getIdTokenResult();

      const ratingPlatformList = await getRatingPlatformsBySubscriberID(employee.subscriber_id, token);
      if (isNil(ratingPlatformList)) {
        return;
      }

      setRatingPlatforms(ratingPlatformList);
    };

    getAndSetRatingPlatform();
  }, [employee]);

  if (isNil(ratingPlatforms)) {
    return <MainContainerLoadingStyled />;
  }

  return (
    <div>
      <RatingPlatformSetting employee={employee} ratingPlatforms={ratingPlatforms} user={user} />
    </div>
  );
}
