/**
 * Получить отформатированное время
 * @param datetime {string} Строка, которая кастится к Date
 * @returns {string} Отформатированное время в виде строки
 */
export const getTimeInLocaleString = datetime => {
  return new Date(datetime).toLocaleTimeString("ru-RU", {hour: "numeric", minute: "numeric"});
};

/**
 * Получить отформатированный день из даты
 * @param datetime {string} Строка, которая кастится к Date
 * @returns {string} Отформатированный день в виде строки
 */
export const getDayInLocaleString = datetime => {
  return new Date(datetime).toLocaleDateString("ru-RU", { day: "numeric", month: "long"});
};

/**
 * Проверка на то, что это новый день
 * @param messages {Array<MessageModel>} все сообщения в чате
 * @param index {number} индекс текущего сообщения
 * @returns {boolean}
 */
export const isNewDay = (messages, index) => {
  if (index === 0) return true;
  const prevMessageTime = new Date(messages[index - 1].time);
  const newMessageTime = new Date(messages[index].time);
  return newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
    newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
    newMessageTime.getDate() !== prevMessageTime.getDate();
};
