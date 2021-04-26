import firebaseCli from 'firebase';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../styles/globals.css';
import 'antd/dist/antd.css';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};

function MyApp({ Component, pageProps }: AppProps) {
  if (firebaseCli.apps.length === 0) {
    firebaseCli.initializeApp(firebaseConfig);
  }

  return <Component {...pageProps} />;
}

export default MyApp;
