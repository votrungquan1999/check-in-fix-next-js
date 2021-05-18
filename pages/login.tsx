import { Button, Form, Input, Typography } from 'antd';
import firebase from 'firebase';
import { useRouter } from 'next/router';
import 'antd/dist/antd.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginFormButtonStyles, loginFormStyles, loginPageStyles } from '../src/styles/login';

import Checkbox from 'antd/lib/checkbox/Checkbox';
import React from 'react';
import Link from 'antd/lib/typography/Link';
import { Group } from 'antd/lib/avatar';

export default function Login() {
  const router = useRouter();

  const onCheckbox = () => {
    // v will be true or false
  };

  const onFinish = async (value: any) => {
    try {
      if (firebase.apps.length) {
        await firebase.auth().signInWithEmailAndPassword(value.username, value.password);
        router.push('/');
      }
    } catch (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    }
  };

  return (
    <div style={loginPageStyles}>
      <Typography.Title level={1}>Login</Typography.Title>
      <Form style={loginFormStyles} onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: 'input username' }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'input password' }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>

        <Group>
          <Checkbox checked onChange={onCheckbox}>
            Remember Me
          </Checkbox>
          <Link href="/auth/request-password">
            <a>Forgot Password?</a>            
          </Link>
        </Group> 

        <Form.Item>
          <Button type="primary" htmlType="submit" style={loginFormButtonStyles}>
            Submit
          </Button>          
        </Form.Item>        
      </Form>         
      <p>
          Don&apos;t have account?{' '}
          <Link href="/register">
            <a>Register</a>
          </Link>
      </p>
    </div>
  );
}
