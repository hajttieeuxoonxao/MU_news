// Lưu bài đọc sau vào AsyncStorage (bộ nhớ nhỏ trên điện thoại). Lưu cả bài để xem lại khi không có mạng.
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsItem } from '../api/types';

const KEY = 'saved-news';

export function useSaved() {
  const [saved, setSaved] = useState<NewsItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setSaved(JSON.parse(raw)); })
      .catch(() => {}); // đọc lỗi thì coi như chưa lưu gì
  }, []);

  const toggle = useCallback((item: NewsItem) => {
    setSaved((prev) => {
      const next = prev.some((x) => x.id === item.id) ? prev.filter((x) => x.id !== item.id) : [item, ...prev];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { saved, toggle, isSaved: (id: string) => saved.some((x) => x.id === id) };
}
