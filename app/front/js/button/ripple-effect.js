document.addEventListener('click', (e) => {
  const closestButton = e.target.closest('.button');
  if (closestButton) {
    const targetCoords = e.target.getBoundingClientRect();
    const x = e.clientX - targetCoords.left;
    const y = e.clientY - targetCoords.top;
    const rippleElement = document.createElement('span');
    rippleElement.classList.add('ripple-effect');
    rippleElement.style.left = `${x}px`;
    rippleElement.style.top = `${y}px`;
    closestButton.appendChild(rippleElement);
    setTimeout(() => {
      rippleElement.remove();
    }, 500);
  }
});
