// Thẻ tin: ảnh, tiêu đề, tóm tắt, nguồn, thời gian, nút lưu. Bấm vào mở bài gốc trên trình duyệt.
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsItem } from '../api/types';
import { useColors } from '../theme';

type Props = { item: NewsItem; saved: boolean; onToggleSave: (item: NewsItem) => void };

const timeAgo = (iso: string) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} giờ trước`;
  return `${Math.round(minutes / 1440)} ngày trước`;
};

export default function NewsCard({ item, saved, onToggleSave }: Props) {
  const c = useColors();
  return (
    <Pressable
      onPress={() => Linking.openURL(item.link)}
      style={{ backgroundColor: c.card, marginHorizontal: 12, marginVertical: 6, borderRadius: 10, overflow: 'hidden' }}>
      {item.image ? <Image source={{ uri: item.image }} style={{ height: 160, backgroundColor: c.light }} /> : null}
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: c.text }}>{item.title}</Text>
        {item.summary ? <Text numberOfLines={3} style={{ marginTop: 6, color: c.gray }}>{item.summary}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: c.gray, fontSize: 12, flex: 1 }}>
            {item.source} · {timeAgo(item.publishedAt)}{item.isTransfer ? ' · Chuyển nhượng' : ''}
          </Text>
          <Pressable hitSlop={12} onPress={() => onToggleSave(item)}>
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={c.red} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
