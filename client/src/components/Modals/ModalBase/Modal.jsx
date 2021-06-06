import React from "react";
import PropTypes from 'prop-types';

import './modal.css';
import {Overlay} from "../../UtilComponents/Overlay/Overlay";
import FocusLock from "react-focus-lock";
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../../store/slices/appSlice/appSelectors";

export const Modal = ({as, className, onOverlayClick, children, ...otherProps}) => {
  const ResAs = as ? as : 'section';
  const isDarkTheme = useSelector(selectIsDarkTheme);

  return (
    <FocusLock>
      <Overlay onClick={onOverlayClick}/>
      <ResAs role="dialog"
             className={`modal ${className ? className : ''} ${isDarkTheme ? 'modal_dark' : ''}`} {...otherProps}>
        {children}
      </ResAs>
    </FocusLock>
  );
};

Modal.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  onOverlayClick: PropTypes.func,
  children: PropTypes.node
};
