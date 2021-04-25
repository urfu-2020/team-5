import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import './ripple.css';

export function Ripple({ duration }) {
  const [rippleArray, setRippleArray] = useState([]);

  useEffect(() => {
    let bounce;
    if (rippleArray.length > 0) {
      window.clearTimeout(bounce);

      bounce = window.setTimeout(() => {
        setRippleArray([]);
        window.clearTimeout(bounce);
      }, duration * 4);
    }

    return () => window.clearTimeout(bounce);
  }, [rippleArray.length, duration]);

  const addRipple = (event) => {
    // Координаты контейнера
    const rippleContainer = event.currentTarget.getBoundingClientRect();

    // Выбираем самую длинную сторону
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;

    // Координаты щелчка мыши
    const x = event.pageX - rippleContainer.left - size / 2;
    const y = event.pageY - rippleContainer.top - size / 2;

    // Новая рябь
    const newRipple = {
      x,
      y,
      size
    };

    setRippleArray([...rippleArray, newRipple]);
  };

  return (
    <div className="ripple-container" onMouseDown={addRipple} aria-hidden>
      {rippleArray.length > 0 &&
      rippleArray.map((ripple, index) => {
        return (
          <span
            key={"span" + index}
            style={{
              animationDuration: `${duration}ms`,
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        );
      })}
    </div>
  );
}


Ripple.propTypes = {
  duration: PropTypes.number.isRequired
};
