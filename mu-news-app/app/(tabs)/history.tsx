// Tab 5: Lịch sử (danh hiệu + danh sách các mùa Premier League từ 2010-11)
import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useApi } from '../../src/hooks/useApi';
import { SeasonRow, Team } from '../../src/api/types';
import StateView from '../../src/components/StateView';
import { useColors } from '../../src/theme';

export default function HistoryTab() {
  const c = useColors();
  const seasons = useApi<SeasonRow[]>('/seasons');
  const team = useApi<Team>('/team');

  return (
    <StateView loading={seasons.loading && !seasons.data} error={seasons.data ? null : seasons.error} empty={!!seasons.data && seasons.data.length === 0} onRetry={seasons.reload}>
      <FlatList
        style={{ backgroundColor: c.light }}
        data={seasons.data ?? []}
        keyExtractor={(s) => s.season}
        ListHeaderComponent={
          <View style={{ padding: 12 }}>
            <Text style={{ fontWeight: '700', marginBottom: 6, color: c.text }}>Danh hiệu</Text>
            {(team.data?.honours ?? []).map((h) => (
              <Text key={h.competition} style={{ color: c.text, marginVertical: 2 }}>
                {h.competition}: {h.titles} lần{h.lastWon ? ` (gần nhất ${h.lastWon})` : ''}
              </Text>
            ))}
            {team.data && team.data.honours.length === 0 ? <Text style={{ color: c.gray }}>Chưa có dữ liệu (honours.json).</Text> : null}
            <Text style={{ fontWeight: '700', marginTop: 16, color: c.text }}>Các mùa giải Premier League</Text>
          </View>
        }
        renderItem={({ item: s }) => (
          <Pressable onPress={() => router.push(`/season/${s.season}`)}
            style={{ backgroundColor: c.card, padding: 14, marginHorizontal: 12, marginVertical: 4, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '600', color: c.text }}>{s.season}</Text>
            <Text style={{ color: c.text }}>Hạng {s.position} - {s.points} điểm ({s.won}T {s.drawn}H {s.lost}B)</Text>
          </Pressable>
        )}
      />
    </StateView>
  );
}
