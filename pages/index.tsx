// import { Button, Form, Input } from 'antd'
// import Head from 'next/head'
// import styles from '../styles/Home.module.css'

import { Button } from 'antd';
import firebase from 'firebase';
import React, { useCallback } from 'react';
import withAuth, { WithAuthProps } from '../src/firebase/withAuth';

import 'antd/dist/antd.css';

function Home(props: WithAuthProps) {
  const handleClick = useCallback(() => {
    firebase.auth().signOut();
  }, []);

  const { user } = props;

  return (
    <div>
      <p>Your email is {user.email ? user.email : 'unknown'}.</p>
      <Button onClick={handleClick}>log out</Button>
    </div>
  );
}

export default withAuth(Home);
