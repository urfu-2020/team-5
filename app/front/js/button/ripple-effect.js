document.addEventListener('click', (e) => {
  if (e.target.classList.contains('button')) {
    const targetCoords = e.target.getBoundingClientRect();
    const x = e.clientX - targetCoords.left;
    const y = e.clientY - targetCoords.top;
    const rippleElement = document.createElement('span');
    rippleElement.classList.add('ripple-effect');
    rippleElement.style.left = `${x}px`;
    rippleElement.style.top = `${y}px`;
    e.target.appendChild(rippleElement);
    setTimeout(() => {
      rippleElement.remove();
    }, 500);
  }
});
