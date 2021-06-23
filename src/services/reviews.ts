import axios from 'axios';
import { CommonResponse } from './common';

export interface Review {
  id: string;
  customer_id: string;
  subscriber_id: string;
  rating?: number;
  feedback?: string;
  is_reviewed?: string;
}

export async function createReviewsByCustomerIDs(customerIDs: string[], token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const reqURL = `${baseBEURL}/private/reviews`;

  const payload = {
    customers: customerIDs.map((id) => ({ id })),
  };

  try {
    const resp = await axios.post<CommonResponse<Review[]>>(reqURL, payload, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 201) {
      alert(`create reviews error, due to ${resp.data.error?.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`create reviews error, please contact tech support for help`);
    return [];
  }
}

export async function getReviewByID(id: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const reqURL = `${baseBEURL}/public/reviews/${id}`;

  try {
    const resp = await axios.get<CommonResponse<Review>>(reqURL, {
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get review error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get review error, please contact tech support for help`);
  }
}

export async function rateReview(id: string, rating: number) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const reqURL = `${baseBEURL}/public/reviews/${id}/ratings`;

  try {
    const resp = await axios.post<CommonResponse<Review>>(
      reqURL,
      {
        rating,
      },
      {
        responseType: 'json',
        validateStatus: (status) => status < 500,
      },
    );

    if (resp.status !== 201) {
      alert(`rate review error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`rate review error, please contact tech support for help`);
  }
}

export async function feedbackReview(id: string, feedback: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const reqURL = `${baseBEURL}/public/reviews/${id}/feedbacks`;

  try {
    const resp = await axios.post<CommonResponse<Review>>(
      reqURL,
      {
        feedback,
      },
      {
        responseType: 'json',
        validateStatus: (status) => status < 500,
      },
    );

    if (resp.status !== 201) {
      alert(`feedback review error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`feedback review error, please contact tech support for help`);
  }
}

export async function getReviewList(subscriberID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const reqURL = `${baseBEURL}/private/reviews?subscriber_id=${subscriberID}`;

  try {
    const resp = await axios.get<CommonResponse<Review[]>>(reqURL, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get review error, due to ${resp.data.error?.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get review error, please contact tech support for help`);
    return [];
  }
}
