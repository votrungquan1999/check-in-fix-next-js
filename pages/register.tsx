import { Button, Checkbox, Form, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import Link from 'antd/lib/typography/Link';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Group } from 'antd/lib/avatar';
import { loginPageStyles, loginFormStyles, loginFormButtonStyles } from '../src/styles/login';

export default function Register() {
    const onCheckbox = () => {
      // v will be true or false
    };
    return (
      <div style={loginPageStyles}>
      <Typography.Title level={1}>Create New Account</Typography.Title>
      <Form style={loginFormStyles} >        
        <Form.Item name="emailaddress" rules={[{ required: true, message: 'Email Address' }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'input password' }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item name="confirmpassword" rules={[{ required: true, message: 'Confirm Password' }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="ConfirmPassword" />
        </Form.Item>
        <Group>
          <Checkbox checked onChange={onCheckbox}>
            Agree to{' '}
          </Checkbox>
          <Link href="/">
            <a>Terms & Conditions</a>            
          </Link>
        </Group> 
        <Form.Item>
          <Button type="primary" htmlType="submit" style={loginFormButtonStyles}>
            REGISTER
          </Button>          
        </Form.Item>        
      </Form>
      
      <p>
          Already have an account?{' '}
          <Link href="/login">
            <a>Log In</a>
          </Link>
      </p>
    </div>
  );
}