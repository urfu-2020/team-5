import React, {useCallback, useState} from "react";

import './create-new-channel-modal.css';

import {Modal} from "../ModalBase/Modal";
import {Button} from "../../UtilComponents/Button/Button";
import {CloseIcon} from "../../UtilComponents/Icons/CloseIcon";
import {ErrorOnEmptyInput} from "../../UtilComponents/Inputs/ErrorOnEmptyInput/ErrorOnEmptyInput";
import {BaseInput} from "../../UtilComponents/Inputs/BaseInput/BaseInput";
import {NewChannelIcon} from "../../UtilComponents/Icons/NewChannelIcon";
import {setNewChannelModalOpen} from "../../../store/slices/appSlice/appSlice";
import {useDispatch} from "react-redux";
import {createNewChannel} from "../../../store/middlewares/socketReduxActions";


export const CreateNewChannelModal = () => {
  const [channelTitle, setChannelTitle] = useState('');
  const [channelDescription, setChannelDescription] = useState('');

  const dispatch = useDispatch();
  const closeModal = useCallback(() => dispatch(setNewChannelModalOpen(false)), [dispatch]);

  const createChannel = useCallback(() => {
    dispatch(createNewChannel(channelTitle, channelDescription));
    dispatch(setNewChannelModalOpen(false));
  })

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <Modal
      onOverlayClick={closeModal}
      className="create-new-channel-modal"
      role="dialog"
      aria-label="Модальное окно создания канала."
      aria-labelledby="input-chat-title"
    >
      <Button
        onClick={closeModal}
        className="rounded-button centred-button create-chat-modal__close-icon"
        Icon={<CloseIcon className="svg-button"/>}
      />
      <div className="channel-info">
        <div className="channel-info__first-row">
          <NewChannelIcon className="create-new-channel-modal__channel-avatar default-channel-avatar"/>
          <div className="create-new-channel-modal__channel-title-input-wrapper">
            <label className="input-channel-title-label" htmlFor="input-channel-title">Введите название канала:</label>
            <ErrorOnEmptyInput
              value={channelTitle}
              onChange={setChannelTitle}
              type="text"
              id="input-channel-title"
              errorMessage="Название канала не может быть пустым"
            />
          </div>
        </div>
        <div className="channel-info__second-row">
          <label className="input-channel-description-label" htmlFor="input-channel-description">
            Введите описание канала (необязательно):
          </label>
          <BaseInput
            value={channelDescription}
            onChange={e => setChannelDescription(e.target.value)}
            id="input-channel-description"
          />
        </div>
      </div>
      <div className="create-new-channel-modal__buttons">
        <Button className="text-button" onClick={closeModal}> Отмена </Button>
        <Button
          disabled={channelTitle === ''}
          className="text-button"
          onClick={createChannel}
        > Создать </Button>
      </div>
    </Modal>
  );
};
