// Tab 1: Tin tức, có bộ lọc Chuyển nhượng, ô tìm kiếm và lối vào màn Bài đã lưu
import { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../../src/hooks/useApi';
import { useSaved } from '../../src/hooks/useSaved';
import { NewsItem } from '../../src/api/types';
import Chip from '../../src/components/Chip';
import NewsCard from '../../src/components/NewsCard';
import StateView from '../../src/components/StateView';
import { useColors } from '../../src/theme';

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'transfer', label: 'Chuyển nhượng' },
] as const;

// Tìm không phân biệt hoa thường trong tiêu đề, tóm tắt và tên nguồn (lọc ngay trên điện thoại)
const matches = (item: NewsItem, q: string) =>
  `${item.title} ${item.summary} ${item.source}`.toLowerCase().includes(q.trim().toLowerCase());

export default function NewsTab() {
  const c = useColors();
  const [type, setType] = useState<'all' | 'transfer'>('all');
  const [query, setQuery] = useState('');
  const { data, error, loading, reload } = useApi<NewsItem[]>(`/news?type=${type}&limit=30`);
  const { toggle, isSaved } = useSaved();
  const shown = query.trim() ? (data ?? []).filter((i) => matches(i, query)) : data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: c.light }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingTop: 12, gap: 8, alignItems: 'center' }}>
        {FILTERS.map((f) => <Chip key={f.key} label={f.label} active={type === f.key} onPress={() => setType(f.key)} />)}
        <View style={{ flex: 1 }} />
        <Link href="/saved" style={{ color: c.red, fontWeight: '600' }}>Đã lưu</Link>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 12, paddingHorizontal: 12, borderRadius: 10, backgroundColor: c.card }}>
        <Ionicons name="search-outline" size={18} color={c.gray} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm trong tin tức…"
          placeholderTextColor={c.gray}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: c.text }}
        />
        {query ? <Ionicons name="close-circle" size={18} color={c.gray} onPress={() => setQuery('')} /> : null}
      </View>

      <StateView loading={loading && !data} error={data ? null : error} empty={!!data && data.length === 0} onRetry={reload}>
        <FlatList
          data={shown}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <NewsCard item={item} saved={isSaved(item.id)} onToggleSave={toggle} />}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: c.gray }}>Không có tin nào khớp "{query}".</Text>}
          keyboardShouldPersistTaps="handled"
          refreshing={loading}
          onRefresh={reload}
        />
      </StateView>
    </View>
  );
}
