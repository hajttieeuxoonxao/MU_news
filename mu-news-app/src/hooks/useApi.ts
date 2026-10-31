// Custom Hook: tải dữ liệu từ backend và giữ ba trạng thái (đang tải, lỗi, có dữ liệu)
import { useCallback, useEffect, useState } from 'react';
import { get } from '../api/client';

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await get<T>(path)); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [path]);

  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load };
}
