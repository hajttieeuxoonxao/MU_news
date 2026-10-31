// Thanh 5 tab: Tin tức, Đội hình, Trận đấu, BXH, Lịch sử
import { Tabs } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/theme';

const tab = (name: string, title: string, icon: keyof typeof Ionicons.glyphMap) => (
  <Tabs.Screen name={name} options={{
    title,
    tabBarIcon: ({ color, size }) => <Ionicons name={icon} size={size} color={color as string} />,
  }} />
);

export default function TabLayout() {
  const c = useColors();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: c.red,
      tabBarInactiveTintColor: c.gray,
      tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border },
      headerStyle: { backgroundColor: c.red },
      headerTintColor: c.onRed,
    }}>
      {tab('index', 'Tin tức', 'newspaper-outline')}
      {tab('squad', 'Đội hình', 'people-outline')}
      {tab('matches', 'Trận đấu', 'football-outline')}
      {tab('table', 'BXH', 'podium-outline')}
      {tab('history', 'Lịch sử', 'time-outline')}
    </Tabs>
  );
}
