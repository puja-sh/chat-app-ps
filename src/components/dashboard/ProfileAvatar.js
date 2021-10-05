import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../../misc/helper';

const ProfileAvatar = ({ name, ...restAvatarProps }) => {
  return (
    <Avatar
      circle
      {...restAvatarProps}
      style={{ background: '#edfae1', color: '#4caf50' }}
    >
      {getNameInitials(name)}
    </Avatar>
  );
};

export default ProfileAvatar;
