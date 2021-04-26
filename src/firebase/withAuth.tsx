import React, { Component, useCallback, useEffect, useState } from 'react';
import firebase from 'firebase';
import { NextRouter, useRouter } from 'next/router';
import { Subtract } from 'utility-types';
import { Spin } from 'antd';
import { SpinningContainer } from './styles';

import 'antd/dist/antd.css';

export interface WithAuthProps {
  user: firebase.User;
}

export default function withAuth<P extends WithAuthProps>(
  Component: React.ComponentType<P>,
) {
  return (props: Subtract<P, WithAuthProps>) => {
    const [user, setUser] = useState<firebase.User>();
    const router = useRouter();

    useEffect(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          router.push('/login');
          return;
        }
        setUser(user);
      });
    }, []);

    return user ? (
      <Component {...(props as P)} user={user} />
    ) : (
      <SpinningContainer>
        <Spin size="large" />
      </SpinningContainer>
    );
  };
}
