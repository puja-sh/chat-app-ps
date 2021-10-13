import React from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import { getUserUpdates } from '../../misc/helper';
import EditableInput from '../EditableInput';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOutHandler }) => {
  const { profile } = useProfile();

  const onSaveHandler = async newData => {
    // const userNicknameRef = database
    //   .ref(`profiles/${profile.uid}`)
    //   .child('name');

    try {
      // await userNicknameRef.set(newData); // update child 'name' with new Data

      const updates = await getUserUpdates(
        profile.uid,
        'name',
        newData,
        database
      );

      await database.ref().update(updates);

      Alert.info('Nickname has been updated', 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title> Dashboard </Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h3>Hey! {profile.name} </h3>
        <ProviderBlock />
        <Divider />
        <EditableInput
          name="nickname"
          initialValue={profile.name}
          onSaveHandler={onSaveHandler}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUploadBtn />
      </Drawer.Body>

      <Drawer.Footer>
        <Button block color="red" onClick={onSignOutHandler}>
          SignOut
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
