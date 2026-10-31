// Tab 2: Đội hình (cầu thủ gom nhóm theo vị trí, và ban huấn luyện; chuyển bằng hai nút)
import { useState } from 'react';
import { FlatList, Pressable, SectionList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useApi } from '../../src/hooks/useApi';
import { Player, Team } from '../../src/api/types';
import Chip from '../../src/components/Chip';
import StateView from '../../src/components/StateView';
import { useColors } from '../../src/theme';

const Row = ({ title, sub, right, onPress }: { title: string; sub?: string; right?: string; onPress?: () => void }) => {
  const c = useColors();
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: c.card, padding: 14, marginHorizontal: 12, marginVertical: 4, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600', color: c.text }}>{title}</Text>
        {sub ? <Text style={{ color: c.gray, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      {right ? <Text style={{ color: c.gray }}>{right}</Text> : null}
    </Pressable>
  );
};

// Gom cầu thủ theo vị trí, giữ thứ tự backend đã sắp (Thủ môn → Hậu vệ → Tiền vệ → Tiền đạo)
function groupByPosition(players: Player[]) {
  const sections: { title: string; data: Player[] }[] = [];
  for (const p of players) {
    const last = sections[sections.length - 1];
    if (last && last.title === p.position) last.data.push(p);
    else sections.push({ title: p.position, data: [p] });
  }
  return sections;
}

export default function SquadTab() {
  const c = useColors();
  const [view, setView] = useState<'players' | 'staff'>('players');
  const squad = useApi<{ updatedAt: string; players: Player[] }>('/squad');
  const team = useApi<Team>('/team');
  const current = view === 'players' ? squad : team;

  return (
    <View style={{ flex: 1, backgroundColor: c.light }}>
      <View style={{ flexDirection: 'row', padding: 12, gap: 8 }}>
        <Chip label="Cầu thủ" active={view === 'players'} onPress={() => setView('players')} />
        <Chip label="Ban huấn luyện" active={view === 'staff'} onPress={() => setView('staff')} />
      </View>

      <StateView loading={current.loading && !current.data} error={current.data ? null : current.error} onRetry={current.reload}>
        {view === 'players' ? (
          <SectionList
            sections={groupByPosition(squad.data?.players ?? [])}
            keyExtractor={(p) => String(p.id)}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section }) => (
              <Text style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, fontWeight: '700', color: c.red, backgroundColor: c.light }}>
                {section.title} ({section.data.length})
              </Text>
            )}
            renderItem={({ item }) => (
              <Row title={item.name} sub={item.status}
                   right={`${item.stats.goals} bàn`} onPress={() => router.push(`/player/${item.id}`)} />
            )}
          />
        ) : (
          <FlatList
            data={team.data?.staff ?? []}
            keyExtractor={(s) => s.name + s.role}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: c.text }}>Chưa có dữ liệu. Nhóm chưa điền staff.json (mục A3).</Text>}
            renderItem={({ item }) => <Row title={item.name} sub={item.role} right={item.nationality ?? ''} />}
          />
        )}
      </StateView>
    </View>
  );
}
