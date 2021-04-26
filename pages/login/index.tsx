import { Button, Form, Input } from 'antd';
import firebase from 'firebase';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import 'antd/dist/antd.css';

export default function Login() {
  const router = useRouter();

  // const user = useMemo(() => {

  //   return firebase.auth().currentUser;
  // }, []);

  const onFinish = async (value: any) => {
    try {
      if (firebase.apps.length) {
        await firebase
          .auth()
          .signInWithEmailAndPassword(value.username, value.password);
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (user !== null) {
  //     router.push('/');
  //   }
  // }, [user]);

  // const onFinishFailed = (value: any) => {}

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'input username' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'input password' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
