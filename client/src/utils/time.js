/**
 *
 * @param datetime {string}
 * @returns {string}
 */
export const getTimeInLocaleString = datetime => {
  return new Date(datetime).toLocaleTimeString("ru-RU", {hour: "numeric", minute: "numeric"});
};

/**
 *
 * @param datetime {string}
 * @returns {string}
 */
export const getDayInLocaleString = datetime => {
  return new Date(datetime).toLocaleDateString("ru-RU", { day: "numeric", month: "long"});
};
