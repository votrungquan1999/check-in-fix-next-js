// import { Button, Form, Input } from 'antd'
// import Head from 'next/head'
// import styles from '../styles/Home.module.css'

import { Button } from 'antd';
import firebase from 'firebase';
import React, { useCallback } from 'react';
import withAuth, { WithAuthProps } from '../src/firebase/withAuth';
import MainContainer from '../src/Components/Layout/Containter';

import 'antd/dist/antd.css';

function Home() {
  return <MainContainer />;
}

export default Home;
