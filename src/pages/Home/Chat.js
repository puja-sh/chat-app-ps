import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';

import ChatTop from '../../components/chat-window/top/Index';
import ChatBottom from '../../components/chat-window/bottom/Index';
import Messages from '../../components/chat-window/messages/Index';
import { useRooms } from '../../context/rooms.context';

const Chat = () => {
  const { chatId } = useParams(); // chat id from the route

  const rooms = useRooms(); // rooms data from useRooms Context

  if (!rooms) {
    // if not rooms
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }

  const currentRoom = rooms.find(room => room.id === chatId); // if roomid == route id then currentRoom

  // If chat room not correct
  if (!currentRoom) {
    return <h6 className="text-center mt-page"> Chat {chatId} not found!</h6>;
  }

  return (
    <>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <Messages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </>
  );
};

export default Chat;
