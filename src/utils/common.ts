import { LoadingOptionsResolved } from 'element-plus';

export function padNum(num: number) {
  return String(num).padStart(2, '0');
}

export function formatDate(
  time: number | string,
  format = 'YYYY-MM-DD hh:mm:ss',
) {
  const date = new Date(time);
  return format
    .replaceAll('YYYY', String(date.getFullYear()))
    .replaceAll('MM', String(padNum(date.getMonth() + 1)))
    .replaceAll('DD', padNum(date.getDate()))
    .replaceAll('hh', padNum(date.getHours()))
    .replaceAll('mm', padNum(date.getMinutes()))
    .replaceAll('ss', padNum(date.getSeconds()));
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

class FullLoading {
  loadingService: ReturnType<typeof ElLoading.service> | null = null;

  start(options: Partial<LoadingOptionsResolved> = {}) {
    this.loadingService = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)',
      ...options,
    });
  }

  close() {
    this.loadingService?.close();
  }
}
export const fullLoading = new FullLoading();
