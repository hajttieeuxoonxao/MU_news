// Tab 3: Trận đấu (sắp tới và kết quả)
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useApi } from '../../src/hooks/useApi';
import { Match } from '../../src/api/types';
import Chip from '../../src/components/Chip';
import StateView from '../../src/components/StateView';
import { useColors } from '../../src/theme';

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const SCOPES = [
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'results', label: 'Kết quả' },
] as const;

export default function MatchesTab() {
  const c = useColors();
  const [scope, setScope] = useState<'upcoming' | 'results'>('upcoming');
  const { data, error, loading, reload } = useApi<Match[]>(`/matches?scope=${scope}&limit=15`);

  return (
    <View style={{ flex: 1, backgroundColor: c.light }}>
      <View style={{ flexDirection: 'row', padding: 12, gap: 8 }}>
        {SCOPES.map((s) => <Chip key={s.key} label={s.label} active={scope === s.key} onPress={() => setScope(s.key)} />)}
      </View>
      <StateView loading={loading && !data} error={data ? null : error} empty={!!data && data.length === 0} onRetry={reload}>
        <FlatList
          data={data ?? []}
          keyExtractor={(m) => String(m.id)}
          refreshing={loading}
          onRefresh={reload}
          renderItem={({ item: m }) => (
            <View style={{ backgroundColor: c.card, padding: 14, marginHorizontal: 12, marginVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: c.gray, fontSize: 12 }}>{m.competition} - {fmt(m.date)}</Text>
              <Text style={{ fontWeight: '700', marginTop: 4, color: c.text }}>
                {m.home} {m.homeGoals !== null ? `${m.homeGoals} - ${m.awayGoals}` : 'vs'} {m.away}
              </Text>
            </View>
          )}
        />
      </StateView>
    </View>
  );
}
