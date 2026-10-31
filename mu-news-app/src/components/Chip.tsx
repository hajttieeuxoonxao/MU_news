// Nút lọc dạng viên thuốc (dùng ở Tin tức, Đội hình, Trận đấu). Đang chọn: nền đỏ chữ trắng.
import { Pressable, Text } from 'react-native';
import { useColors } from '../theme';

export default function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress}
      style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: active ? c.red : c.card }}>
      <Text style={{ color: active ? c.onRed : c.text }}>{label}</Text>
    </Pressable>
  );
}
