// Hiển thị đúng một trong bốn trạng thái: đang tải, lỗi (có nút Thử lại), chưa có dữ liệu, có dữ liệu
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useColors } from '../theme';

type Props = { loading: boolean; error: string | null; empty?: boolean; onRetry: () => void; children: React.ReactNode };

export default function StateView({ loading, error, empty, onRetry, children }: Props) {
  const c = useColors();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: c.light }}><ActivityIndicator size="large" color={c.red} /></View>;
  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: c.light }}>
      <Text style={{ textAlign: 'center', marginBottom: 12, color: c.text }}>{error}</Text>
      <Pressable onPress={onRetry} style={{ backgroundColor: c.red, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
        <Text style={{ color: c.onRed, fontWeight: '600' }}>Thử lại</Text>
      </Pressable>
    </View>
  );
  if (empty) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.light }}><Text style={{ color: c.text }}>Chưa có dữ liệu.</Text></View>;
  return <>{children}</>;
}
