// Tab 4: Bảng xếp hạng Premier League mùa hiện tại
import { Text, View } from 'react-native';
import { useApi } from '../../src/hooks/useApi';
import { StandingRow } from '../../src/api/types';
import LeagueTable from '../../src/components/LeagueTable';
import StateView from '../../src/components/StateView';
import { useColors } from '../../src/theme';

export default function TableTab() {
  const c = useColors();
  const { data, error, loading, reload } = useApi<{ season: string; table: StandingRow[] }>('/standings');
  return (
    <StateView loading={loading && !data} error={data ? null : error} onRetry={reload}>
      <View style={{ flex: 1, backgroundColor: c.light }}>
        <Text style={{ padding: 12, fontWeight: '700', color: c.text }}>Premier League {data?.season}</Text>
        <LeagueTable rows={data?.table ?? []} />
      </View>
    </StateView>
  );
}
