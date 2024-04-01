export function debounce(func: () => any, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
}
