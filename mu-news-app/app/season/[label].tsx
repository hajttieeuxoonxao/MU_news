// Chi tiết một mùa: BXH đầy đủ cuối mùa + các trận của Manchester United (từ CSV lịch sử)
import { FlatList, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApi } from '../../src/hooks/useApi';
import { SeasonDetail } from '../../src/api/types';
import LeagueTable from '../../src/components/LeagueTable';
import StateView from '../../src/components/StateView';
import { useColors } from '../../src/theme';

export default function SeasonScreen() {
  const c = useColors();
  const { label } = useLocalSearchParams<{ label: string }>();
  const { data, error, loading, reload } = useApi<SeasonDetail>(`/seasons/${label}`);

  return (
    <StateView loading={loading} error={error} onRetry={reload}>
      {data && (
        <FlatList
          style={{ backgroundColor: c.light }}
          data={data.matches}
          keyExtractor={(m, i) => m.date + i}
          ListHeaderComponent={
            <View>
              <Text style={{ padding: 12, fontSize: 18, fontWeight: '800', color: c.text }}>Mùa {label}</Text>
              <LeagueTable rows={data.table} scroll={false} />
              <Text style={{ padding: 12, fontWeight: '700', color: c.text }}>Các trận của Manchester United</Text>
            </View>
          }
          renderItem={({ item: m }) => (
            <Text style={{ paddingHorizontal: 12, paddingVertical: 4, color: c.text }}>
              {m.date}  {m.home} {m.homeGoals} - {m.awayGoals} {m.away}
            </Text>
          )}
        />
      )}
    </StateView>
  );
}
