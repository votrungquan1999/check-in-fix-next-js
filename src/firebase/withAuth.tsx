import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { useRouter } from 'next/router';
import { Subtract } from 'utility-types';
import 'antd/dist/antd.css';
import { Employee, getEmployeeInfo } from '../services/employee';
import { CustomSpinner } from '../styles/commons';

export interface WithAuthProps {
  user: firebase.User;
  employee: Employee;
}

export default function withAuth<P extends WithAuthProps>(Component: React.ComponentType<P>) {
  return (props: Subtract<P, WithAuthProps>) => {
    const [user, setUser] = useState<firebase.User>();
    const [employee, setEmployee] = useState<Employee>();
    const router = useRouter();

    useEffect(() => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          router.push('/login');
          return;
        }

        const idToken = await user.getIdToken();
        const currentEmployee = await getEmployeeInfo(idToken);

        if (!currentEmployee) {
          return;
        }

        setUser(user);
        setEmployee(currentEmployee);
      });
    }, []);

    return user && employee ? (
      <Component {...(props as P)} user={user} employee={employee} />
    ) : (
      <div className="h-screen">
        <CustomSpinner />
      </div>
    );
  };
}
