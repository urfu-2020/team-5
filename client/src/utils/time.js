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


export const isNewDay = (messages, index) => {
  if (index === 0) return true;
  const prevMessageTime = new Date(messages[index - 1].time);
  const newMessageTime = new Date(messages[index].time);
  return newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
    newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
    newMessageTime.getDate() !== prevMessageTime.getDate();
};
