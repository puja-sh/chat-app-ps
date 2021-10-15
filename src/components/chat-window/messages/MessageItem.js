import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import {
  useHover,
  useMediaQuery,
  usePresence,
} from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import ImgBtnModal from './ImgBtnModal';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const renderFileMessage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220 mt-2">
        <ImgBtnModal src={file.url} file={file.name} />
      </div>
    );
  }

  if (file.contentType.includes('audio')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your browser does not support the audio element
      </audio>
    );
  }
  return <a href={file.url}>Download {file.name} </a>;
};

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, file, likes, likeCount } = message;

  const [selfRef, isHovered] = useHover();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHovered;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid); // indicates message is liked by particular user

  const presence = usePresence(author.uid);

  return (
    <li
      className={`padded mb-1 text-white cursor-pointer ${
        isHovered ? 'bg-black-01' : 'bg-black-02'
      }`}
      ref={selfRef}
    >
      <div className="d-flex justify-content-between pr-4">
        <div className="d-flex align-items-center font-bolder mb-1">
          <PresenceDot uid={author.uid} />
          {presence && (
            <ProfileAvatar
              src={author.avatar}
              name={author.name}
              className={`ml=1 mr-1 ${
                presence.state === 'online' ? 'border-green' : ''
              }`}
              size="md"
            />
          )}
          <ProfileInfoBtnModal
            profile={author}
            appearance="link"
            className="p-0 ml-1 text-black font-small"
          >
            {canGrantAdmin && (
              <Button
                block
                onClick={() => handleAdmin(author.uid)}
                color="blue"
              >
                {isMsgAuthorAdmin ? 'Remove admin permission' : 'Make admin'}{' '}
              </Button>
            )}
          </ProfileInfoBtnModal>
        </div>
        <div className="d-flex align-items-center font-bolder mb-1">
          {/* <span className="ml-2"> {author.name} </span> */}
          {/* Delete Btn */}
          {isAuthor && (
            <IconBtnControl
              isVisible={canShowIcons}
              iconName="close"
              tooltip="Delete this message"
              onClick={() => {
                handleDelete(message.id, file);
              }}
            />
          )}
          {/* Like Btn */}
          <IconBtnControl
            {...(isLiked ? { color: 'red' } : {})}
            isVisible="true"
            iconName="heart"
            tooltip="Like this message"
            onClick={() => {
              handleLike(message.id);
            }}
            badgeContent={likeCount}
          />

          <TimeAgo
            datetime={createdAt}
            className="font-normal text-black-45 pl-1"
          />
        </div>
      </div>
      <div>
        {text && <span className="word-breal-all">{text} </span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);
