import React, { memo } from 'react';
import { useCurrentRoom } from '../../../context/current-room.context';

const Top = () => {
  // current-room-context
  const name = useCurrentRoom(v => v.name);

  // name = room name
  return <div>{name}</div>;
};

export default memo(Top);
