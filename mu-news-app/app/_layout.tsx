// Khung chung (Stack): nhóm 5 tab + các màn hình chi tiết.
// ThemeProvider đổi màu thanh tiêu đề, nền màn hình theo chế độ Sáng/Tối của điện thoại.
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { palettes } from '../src/theme';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = palettes[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, primary: c.red, background: c.light, card: c.card, text: c.text, border: c.border },
  };

  return (
    <ThemeProvider value={navTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="player/[id]" options={{ title: 'Cầu thủ' }} />
        <Stack.Screen name="season/[label]" options={{ title: 'Mùa giải' }} />
        <Stack.Screen name="saved" options={{ title: 'Bài đã lưu' }} />
      </Stack>
    </ThemeProvider>
  );
}
