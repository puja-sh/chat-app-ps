import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMsgBtn from './AudioMsgBtn';

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
}

const Bottom = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();
  const { profile } = useProfile();

  const onInputChangeHandler = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClickHandler = async () => {
    if (input.trim() === '') {
      Alert.warning('Please enter a message');
      return;
    }

    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;

    const updates = {};

    const messageId = database.ref('messages').push().key; // we will get unique key in real time database

    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);
    try {
      await database.ref().update(updates);
      setIsLoading(false);
      setInput('');
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 10000);
    }
  };
  const onKeyDownHandler = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClickHandler();
    }
  };

  const afterUpload = useCallback(
    async files => {
      // put file in db
      setIsLoading(true);

      const updates = {};

      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId);
        msgData.file = file;
        const messageId = database.ref('messages').push().key; // we will get unique key in real time database

        updates[`/messages/${messageId}`] = msgData;
      });

      const lastMsgId = Object.keys(updates).pop();

      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Alert.error(error.message, 10000);
      }
    },
    [chatId, profile]
  );

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload} />
        <AudioMsgBtn afterUpload={afterUpload} />
        <Input
          type="text"
          placeholder="Message"
          value={input}
          onChange={onInputChangeHandler}
          onKeyDown={onKeyDownHandler}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClickHandler}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
