/**
 * textを指定したformatに従って読み込む。
 * @param text 読み込み対象の文字列
 * @param format 読み込むフォーマット。任意文字列を%とし、
 * @returns %の位置の文字列を順に格納した配列。
 */
export const formatInput = (text: string, format: string) => {
  return formatInputRecursive(text, format, []);
};

const formatInputRecursive = (text: string, format: string, arr: string[]): string[] | undefined => {
  if (format === '') return text === '' ? arr : undefined;
  if (format[0] !== '%') return format[0] === text[0] ? formatInputRecursive(text.slice(1), format.slice(1), arr) : undefined;
  // ここまで来ていれば、formatの1文字目は%。
  if (format[1] === '%') return undefined;
  let index = text.indexOf(format[1]);
  while (index !== -1) {
    const arr2 = [...arr, text.substring(0, index)];
    const a = formatInputRecursive(text.slice(index), format.slice(1), arr2);
    if (a) return a;
    index = text.indexOf(format[1], index + 1);
  }
  return undefined;
};
