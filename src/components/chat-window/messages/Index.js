import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { transformIntoArray } from '../../../misc/helper';
import MessageItem from './MessageItem';
import { database } from '../../../misc/firebase';

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformIntoArray(snap.val());

        setMessages(data);
      });
    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No Messages yet</li>}
      {canShowMessages &&
        messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default Messages;
