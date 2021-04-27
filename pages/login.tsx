import { Button, Form, Input, Typography } from 'antd';
import firebase from 'firebase';
import { useRouter } from 'next/router';
import 'antd/dist/antd.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginFormButtonStyles, loginFormStyles, loginPageStyles } from '../src/styles/login';

export default function Login() {
  const router = useRouter();

  const onFinish = async (value: any) => {
    try {
      if (firebase.apps.length) {
        await firebase.auth().signInWithEmailAndPassword(value.username, value.password);
        router.push('/');
      }
    } catch (error) {
      alert(`login failed due to ${error.message.error.message}`);
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

        <Form.Item>
          <Button type="primary" htmlType="submit" style={loginFormButtonStyles}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
