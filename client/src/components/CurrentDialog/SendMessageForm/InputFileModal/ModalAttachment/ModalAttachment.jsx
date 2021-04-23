import React from 'react';
import PropTypes from 'prop-types';

export const ModalAttachment = ({ title }) => (
  <section
    className="attachments__attachment attachment"
    aria-label="Прикрепленный файл"
    tabIndex="0"
  >
    <div className="attachment__file-icon-and-name">
      <svg
        className="attachment__pic"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99
                2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
        />
      </svg>
      <p className="attachment__name">
        { title }
      </p>
    </div>
    <div className="attachment__file-buttons">
      <button className="button" aria-label="Редактировать файл" type="button">
        <svg
          className="svg-button"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71
            7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41
             0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          />
        </svg>
      </button>
      <button className="button" aria-label="Открепить файл" type="button">
        <svg
          className="svg-button"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </button>
    </div>
  </section>
);

ModalAttachment.propTypes = {
  title: PropTypes.string.isRequired
};
