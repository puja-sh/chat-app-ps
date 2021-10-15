/* eslint-disable consistent-return */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { groupBy, transformIntoArray } from '../../../misc/helper';
import MessageItem from './MessageItem';
import { auth, database, storage } from '../../../misc/firebase';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}
const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      messagesRef.off();

      messagesRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = transformIntoArray(snap.val());

          setMessages(data);
          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });

      setLimit(prev => prev + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;

      node.scrollTop = newHeight - oldHeight;
    }, 180);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;

    loadMessages();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 190);

    return () => {
      messagesRef.off('value');
    };
  }, [loadMessages]);

  const handleAdmin = useCallback(
    async uid => {
      const adminRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMessage;

      await adminRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMessage = 'Admin permission removed';
          } else {
            admins[uid] = true;
            alertMessage = 'Admin permission granted';
          }
        }
        return admins;
      });

      Alert.info(alertMessage, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    let alertMessage;

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount--;
          msg.likes[uid] = null;
          alertMessage = 'Unliked';
        } else {
          msg.likeCount++;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMessage = 'Liked <3';
        }
      }
      return msg;
    });

    Alert.info(alertMessage, 4000);
  }, []);

  // Delete message function
  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message?')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};

      // delete the original message
      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted');
      } catch (error) {
        return Alert.error(error.message);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          fileRef.delete();
        } catch (error) {
          Alert.error(error.message);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded bg-black-01">
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });
    return items;
  };
  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No Messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
