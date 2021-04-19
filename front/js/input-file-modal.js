import { createFocusTrap } from 'focus-trap';

const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.input-file-modal');
const fileInput = document.querySelector('#input-file');
const modalTextInput = document.querySelector('.input-file-modal__input-text');

const modalFocusTrap = createFocusTrap(modal, {
  returnFocusOnDeactivate: true,
  clickOutsideDeactivates: true,
  escapeDeactivates: true,
  onDeactivate: () => {
    modalOverlay.classList.add('hidden');
    fileInput.value = '';
    modalTextInput.value = '';
  }
});

document.querySelector('#input-file').addEventListener('change', () => {
  modalOverlay.classList.remove('hidden');
  modalOverlay.removeAttribute('aria-hidden');

  modalFocusTrap.activate();

  // const fileName = e.target.value.split('\\').pop(); // TODO...
});

document.querySelector('.input-file-modal__close-button').addEventListener('click', () => {
  modalFocusTrap.deactivate();
});

document.querySelector('.cancel-button').addEventListener('click', () => {
  modalFocusTrap.deactivate();
});
