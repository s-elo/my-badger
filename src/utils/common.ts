export function padNum(num: number) {
  return String(num).padStart(2, '0');
}

export function formatDate(time: number) {
  const date = new Date(time);
  return `${date.getFullYear()}-${padNum(date.getMonth() + 1)}-${padNum(
    date.getDate(),
  )} ${padNum(date.getHours())}:${padNum(date.getMinutes())}:${padNum(
    date.getSeconds(),
  )}`;
}

export function getCurrentRecordTitle() {
  const date = new Date(Date.now());
  return `@RECORD:${date.getFullYear()}-${padNum(date.getMonth() + 1)}`;
}

export function set<T extends Record<string, unknown>>(arr: T[], key: string) {
  const set = new Set();
  return arr.reduce<T[]>((ret, item) => {
    if (!set.has(item[key])) {
      set.add(item[key]);
      ret.push(item);
    }
    return ret;
  }, []);
}
