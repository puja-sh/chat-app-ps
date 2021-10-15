import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon, IconButton } from 'rsuite';
import { isOfflineForDatabase } from '../../context/profile.context';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';
import Dashboard from './Index';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const onSignOutHandler = useCallback(() => {
    database
      .ref(`status/${auth.currentUser.uid}`)
      .set(isOfflineForDatabase)
      .then(() => {
        auth.signOut();
        Alert.info('Sign Out');
        close();
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  }, [close]);

  return (
    <>
      {/* <Button block color="blue" onClick={open}> */}
      {/* <Icon icon="dashboard" /> Dashboard */}
      <IconButton
        block
        color="blue"
        onClick={open}
        icon={<Icon icon="dashboard" />}
        appearance="primary"
        active
      >
        Dashboard
      </IconButton>
      {/* </Button> */}
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOutHandler={onSignOutHandler} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
