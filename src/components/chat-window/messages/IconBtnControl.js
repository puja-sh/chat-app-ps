import React from 'react';
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite';

const ConditionBadge = ({ condition, children }) => {
  return condition ? <Badge content={condition}> {children} </Badge> : children;
};
const IconBtnControl = ({
  isVisible,
  iconName,
  tooltip,
  onClick,
  badgeContent,
  ...props
}) => {
  return (
    <div
      className="mr-2"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <ConditionBadge condition={badgeContent}>
        <Whisper
          placement="top"
          deplay={0}
          deplayHide={0}
          deplayShow={0}
          trigger="hover"
          speaker={<Tooltip> {tooltip} </Tooltip>}
        >
          <IconButton
            {...props}
            onClick={onClick}
            circle
            size="xs"
            icon={<Icon icon={iconName} />}
          />
        </Whisper>
      </ConditionBadge>
    </div>
  );
};

export default IconBtnControl;
