import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditableInput = ({
  initialValue,
  onSaveHandler,
  label = null,
  placeholder = 'Write your value',
  emptyMsg = 'Input is Empty',
  wrapperClassName = '',
  ...restInputProps
}) => {
  const [input, setInput] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);

  // Input value change handler
  const inputChangeHandler = useCallback(value => {
    setInput(value);
  }, []);

  // Input value on editing mode
  const onEditClickHandler = useCallback(() => {
    setIsEditable(prev => !prev); // toggle between true and false
    setInput(initialValue); // If cancelled set it to Initial Value
  }, [initialValue]);

  // Input on save
  const onSaveClickHandler = async () => {
    const trimmed = input.trim(); // Remove left & right white space
    if (trimmed === '') {
      Alert.info({ emptyMsg });
    }

    if (trimmed !== initialValue) {
      await onSaveHandler(input); // onSaveHandler is in Dashboard passing saved value
    }
    setIsEditable(false);
  };

  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup>
        <Input
          {...restInputProps}
          disabled={!isEditable}
          placeholder={placeholder}
          value={input}
          onChange={inputChangeHandler}
        />
        <InputGroup.Button onClick={onEditClickHandler}>
          <Icon icon={isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>
        {isEditable && (
          <InputGroup.Button onClick={onSaveClickHandler}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
