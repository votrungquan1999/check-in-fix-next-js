import {
  DatabaseOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, Spin } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import withAuth from '../../firebase/withAuth';
import { getSubscriber, Subscriber } from '../../services/subscribers';
import {
  HeaderUserLogout,
  MainContainerContentstyles,
  MainContainerHeaderStyles,
  MainContainerSiderMenuStyled,
  MainContainerStyles,
  PageNameStyled,
  StoreNameContainer,
} from './styles';
import { Dashboard } from './Dashboard';
import { Tickets } from './Tickets';
import firebase from 'firebase';
import { Customers } from './Customers';

const pageNames = {
  1: 'Dashboard',
  2: 'Tickets',
  3: 'Customers',
};

type contentKeys = '1' | '2' | '3';

export default withAuth(function MainContainer({ employee, user }) {
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const [currentTab, setCurrentTab] = useState<contentKeys>('1');

  const MainContainerContents = useMemo(() => {
    return {
      1: <Dashboard employee={employee} user={user} />,
      2: <Tickets employee={employee} user={user} subscriber={subscriber} />,
      3: <Customers employee={employee} user={user} />,
    };
  }, [employee, subscriber, user]);

  const handleLogout = useCallback(() => {
    firebase.auth().signOut();
  }, []);

  useEffect(() => {
    const getAndSetSubscriber = async function () {
      const subscriberID = employee.subscriber_id;
      const { token } = await user.getIdTokenResult();
      const subscriberInfo = await getSubscriber(subscriberID, token);

      setSubscriber(subscriberInfo);
    };

    getAndSetSubscriber();
  }, [employee, user]);

  const handleClickMenu: MenuClickEventHandler = ({ key }) => {
    setCurrentTab(key as contentKeys);
  };

  return !subscriber ? (
    <Spin />
  ) : (
    <Layout style={MainContainerStyles}>
      <Header style={MainContainerHeaderStyles}>
        <StoreNameContainer>{subscriber.name}</StoreNameContainer>
        <PageNameStyled>{pageNames[currentTab]}</PageNameStyled>
        <HeaderUserLogout>
          <Button onClick={handleLogout}>Logout</Button>
        </HeaderUserLogout>
      </Header>
      <Layout hasSider={true}>
        <Sider collapsible>
          <MainContainerSiderMenuStyled>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleClickMenu}>
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="2" icon={<DatabaseOutlined />}>
                Tickets
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                Customers
              </Menu.Item>
            </Menu>
          </MainContainerSiderMenuStyled>
        </Sider>
        <Layout>
          <Content>{MainContainerContents[currentTab]}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
});
