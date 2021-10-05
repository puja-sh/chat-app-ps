import React from 'react';
import { useCallback } from 'react/cjs/react.development';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth } from '../../misc/firebase';
import Dashboard from './Index';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const onSignOutHandler = useCallback(() => {
    auth.signOut();

    Alert.info('Sign Out');

    close();
  }, [close]);
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOutHandler={onSignOutHandler} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
