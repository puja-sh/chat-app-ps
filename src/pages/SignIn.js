import React from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Col, Container, Grid, Icon, Panel, Row } from 'rsuite';
import { auth, database } from '../misc/firebase';

const SignIn = () => {
  const SignInProvider = async provider => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

      // If it is a new user then store it into the database
      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.uid}`).set({
          // 'ref' is the path and 'set' used to add data in the database
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP, // firebase timestamp
        });
      }
      Alert.success('Signed in', 4000);
    } catch (error) {
      Alert.info(error.message, 4000);
    }
  };
  const googleSignInHandler = () => {
    SignInProvider(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to chat app</h2>
                <p>Friends, Family, Business and Chating</p>
              </div>
              <div className="mt-3">
                <Button block color="green" onClick={googleSignInHandler}>
                  <Icon icon="google" /> Continue with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
