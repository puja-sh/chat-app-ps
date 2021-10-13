import React, { useRef, useState } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';
import ProfileAvatar from './ProfileAvatar';
import { getUserUpdates } from '../../misc/helper';

const fileTypeInput = '.jpeg, .jpg, .png';

const acceptedFileType = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/pjpeg',
];
const isValidFile = file => acceptedFileType.includes(file.type);

const getBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File process error'));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const [img, setImg] = useState(null);
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  const avatarEditorRef = useRef();

  const onFileInputChangeHandler = ev => {
    const currFiles = ev.target.files;

    if (currFiles.length === 1) {
      const file = currFiles[0];

      if (isValidFile(file)) {
        setImg(file); // useState set Image
        open(); // Open modal
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };

  const onUploadClickHandler = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      const blobImage = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`profiles/${profile.uid}`)
        .child('avatar');

      const uploadAvatarResult = await avatarFileRef.put(blobImage, {
        cacheControl: `public, max-age = ${3600 * 24 * 3}`, // store in cache for 3 days
      });

      // convert image into a url to store in db
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      // Uploading in database
      // const uesrAvatarRef = database
      //   .ref(`/profiles/${profile.uid}`)
      //   .child('avatar');

      const updates = await getUserUpdates(
        profile.uid,
        'avatar',
        downloadUrl,
        database
      );
      await database.ref().update(updates);

      // Upload
      // uesrAvatarRef.set(downloadUrl);

      setIsLoading(false); // Uplaoding done to stop the loading
      close();

      Alert.info('Avatar has been uploaded', 4000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-150 height-150 img-fullsize font-huge"
      />
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new Avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={fileTypeInput}
            onChange={onFileInputChangeHandler}
          />
        </label>

        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={150}
                  height={150}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClickHandler}
              disabled={isLoading}
            >
              Upload new Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
