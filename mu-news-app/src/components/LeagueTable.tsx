// Bảng xếp hạng dùng chung cho tab BXH và màn Mùa giải. Dòng Manchester United được tô nền.
// scroll = false khi bảng nằm trong một danh sách cuộn khác (tránh cảnh báo "VirtualizedLists should never be nested")
import { ScrollView, Text, View } from 'react-native';
import { TableRow } from '../api/types';
import { useColors } from '../theme';

const COLS = [
  { key: 'played', label: 'Tr' },
  { key: 'won', label: 'T' },
  { key: 'drawn', label: 'H' },
  { key: 'lost', label: 'B' },
  { key: 'gf', label: 'BT' },
  { key: 'ga', label: 'BB' },
  { key: 'points', label: 'Đ' },
] as const;

export default function LeagueTable({ rows, scroll = true }: { rows: TableRow[]; scroll?: boolean }) {
  const c = useColors();
  const Wrapper = scroll ? ScrollView : View;
  return (
    <Wrapper>
      <View style={{ flexDirection: 'row', padding: 10, backgroundColor: c.dark }}>
        <Text style={{ width: 28, color: '#fff' }}>#</Text>
        <Text style={{ flex: 1, color: '#fff' }}>Đội</Text>
        {COLS.map((col) => <Text key={col.key} style={{ width: 30, textAlign: 'right', color: '#fff' }}>{col.label}</Text>)}
      </View>
      {rows.map((r) => (
        <View key={r.team} style={{ flexDirection: 'row', padding: 10, backgroundColor: r.isUnited ? c.highlight : c.card,
                                     borderBottomWidth: 1, borderColor: c.border }}>
          <Text style={{ width: 28, color: c.text }}>{r.position}</Text>
          <Text style={{ flex: 1, fontWeight: r.isUnited ? '700' : '400', color: c.text }}>{r.team}</Text>
          {COLS.map((col) => (
            <Text key={col.key} style={{ width: 30, textAlign: 'right', color: c.text, fontWeight: col.key === 'points' ? '700' : '400' }}>
              {r[col.key]}
            </Text>
          ))}
        </View>
      ))}
    </Wrapper>
  );
}
