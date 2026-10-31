// Màn hình chi tiết cầu thủ: vị trí, tình trạng, số liệu mùa này và các mùa trước (nguồn FPL)
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApi } from '../../src/hooks/useApi';
import { PlayerDetail, Stats } from '../../src/api/types';
import StateView from '../../src/components/StateView';
import { useColors } from '../../src/theme';

const Line = ({ label, s }: { label: string; s: Stats }) => {
  const c = useColors();
  const cell = { flex: 1, textAlign: 'right' as const, color: c.text };
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderColor: c.border }}>
      <Text style={{ flex: 2, color: c.text }}>{label}</Text>
      <Text style={cell}>{s.minutes}'</Text>
      <Text style={cell}>{s.goals}</Text>
      <Text style={cell}>{s.assists}</Text>
    </View>
  );
};

export default function PlayerScreen() {
  const c = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error, loading, reload } = useApi<PlayerDetail>(`/players/${id}`);

  return (
    <StateView loading={loading} error={error} onRetry={reload}>
      {data && (
        <ScrollView style={{ backgroundColor: c.card }} contentContainerStyle={{ padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: c.text }}>{data.profile.name}</Text>
          <Text style={{ color: c.gray, marginVertical: 4 }}>{data.profile.position} · {data.profile.status}</Text>
          {data.profile.news ? <Text style={{ color: c.red, marginBottom: 8 }}>{data.profile.news}</Text> : null}

          <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 4, color: c.text }}>Phút thi đấu · Bàn thắng · Kiến tạo</Text>
          <Line label="Mùa này" s={data.season} />
          {data.pastSeasons.map((s) => <Line key={s.season} label={s.season} s={s} />)}
          {data.pastSeasons.length === 0 ? <Text style={{ color: c.gray, marginTop: 8 }}>Chưa có số liệu các mùa trước.</Text> : null}
        </ScrollView>
      )}
    </StateView>
  );
}
