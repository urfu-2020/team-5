/**
 * В зависимости от n ставит возвращает нужную форму слова
 * @param n {number} Число перед текстом
 * @param text_forms {Array<String>} Формы текста при разных n
 * Пример:    n = 1         n = 2        n = 5
 *          ['участник', 'участника', 'участников']
 * @returns String
 */
export function getDeclOfNum(n, text_forms) {
  n = Math.abs(n) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 === 1) { return text_forms[0]; }
  return text_forms[2];
}
