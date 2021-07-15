import axios from 'axios';
import { CommonResponse } from '../common';

export interface RatingPlatforms {
  id: string;
  name: string;
  url: string;
  subscriber_id: string;
}

export async function getRatingPlatformByReviewID(reviewID: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const reqURL = `${baseBEURL}/public/reviews/${reviewID}/rating-platforms`;

  try {
    const resp = await axios.get<CommonResponse<RatingPlatforms[]>>(reqURL, {
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get rating platforms error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get rating platforms error, please contact tech support for help`);
  }
}

export async function getRatingPlatformsBySubscriberID(subscriberID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const reqURL = `${baseBEURL}/private/settings/rating-platforms?subscriber_id=${subscriberID}`;

  try {
    const resp = await axios.get<CommonResponse<RatingPlatforms[]>>(reqURL, {
      responseType: 'json',
      headers: {
        authorization: token,
      },
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get rating platforms error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get rating platforms error, please contact tech support for help`);
  }
}
