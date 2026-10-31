// Màn hình Bài đã lưu (đọc từ AsyncStorage, xem được khi không có mạng)
import { FlatList, Text, View } from 'react-native';
import { useSaved } from '../src/hooks/useSaved';
import NewsCard from '../src/components/NewsCard';
import { useColors } from '../src/theme';

export default function Saved() {
  const c = useColors();
  const { saved, toggle } = useSaved();
  if (saved.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.light }}>
        <Text style={{ color: c.text }}>Bạn chưa lưu bài nào.</Text>
      </View>
    );
  }
  return (
    <FlatList style={{ backgroundColor: c.light }} data={saved} keyExtractor={(i) => i.id}
      renderItem={({ item }) => <NewsCard item={item} saved onToggleSave={toggle} />} />
  );
}
