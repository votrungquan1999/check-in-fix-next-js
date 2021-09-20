import {
  AccountBookOutlined,
  DatabaseOutlined,
  FormOutlined,
  PieChartOutlined,
  ScheduleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import withAuth from '../../firebase/withAuth';
import { getSubscriber, Subscriber } from '../../services/subscribers';
import {
  HeaderUserLogout,
  MainContainerHeaderStyles,
  MainContainerSiderMenuStyled,
  MainContainerSiderStyles,
  MainContainerStyles,
  PageNameStyled,
  StoreNameContainer,
} from './styles';
import { Dashboard } from './Dashboard';
import { Tickets } from './Tickets';
import firebase from 'firebase';
import { Customers } from './Customers';
import { CustomSpinner } from '../../styles/commons';
import { ReviewPage } from './Review';
import { Settings } from './Settings';
import { Inventories } from './Inventory';
import { PurchasesView } from './Purchases';

const pageNames = {
  1: 'Dashboard',
  2: 'Tickets',
  3: 'Customers',
  4: 'Review',
  5: 'Settings',
  6: 'Inventory',
  7: 'Purchases',
};

type contentKeys = '1' | '2' | '3' | '4' | '5' | '6' | '7';

export default withAuth(function MainContainer({ employee, user }) {
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const [currentTab, setCurrentTab] = useState<contentKeys>('1');
  const [isCollapsedSider, setIsCollapseSider] = useState(false);

  const MainContainerContents = useMemo(() => {
    return {
      1: <Dashboard employee={employee} user={user} />,
      2: <Tickets employee={employee} user={user} />,
      3: <Customers employee={employee} user={user} />,
      4: <ReviewPage employee={employee} user={user} />,
      5: <Settings employee={employee} user={user} />,
      6: <Inventories employee={employee} user={user} />,
      7: <PurchasesView employee={employee} user={user} />,
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

  const handleClickMenu = useCallback(({ key }) => {
    setCurrentTab(key as contentKeys);
  }, []);

  const handleCollapseSider = useCallback((collapsed: boolean) => {
    setIsCollapseSider(collapsed);
  }, []);

  return !subscriber ? (
    <div className="h-screen">
      <CustomSpinner />
    </div>
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
        <Sider style={MainContainerSiderStyles} collapsible onCollapse={handleCollapseSider}>
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
              <Menu.Item key="4" icon={<FormOutlined />}>
                Review
              </Menu.Item>
              <Menu.Item key="5" icon={<SettingOutlined />}>
                Settings
              </Menu.Item>
              <Menu.Item key="6" icon={<ScheduleOutlined />}>
                Inventories
              </Menu.Item>
              <Menu.Item key="7" icon={<AccountBookOutlined />}>
                Purchases
              </Menu.Item>
            </Menu>
          </MainContainerSiderMenuStyled>
        </Sider>
        <Layout
          style={{
            marginLeft: isCollapsedSider ? 80 : 200,
            marginTop: 64,
            height: 'fit-content',
          }}
        >
          <Content>{MainContainerContents[currentTab]}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
});
