// Màu dùng chung cho cả app, khớp với biến màu (chế độ Light/Dark) trong file Figma "MU News - Mobile"
import { useColorScheme } from 'react-native';

export type Palette = {
  red: string; dark: string; gray: string; light: string; card: string;
  text: string; highlight: string; border: string; onRed: string;
};

// light: bảng màu gốc của tài liệu hướng dẫn (bước A6)
const lightPalette: Palette = {
  red: '#DA291C', dark: '#1B1B1B', gray: '#6B6B6B', light: '#F5F5F5', card: '#FFFFFF',
  text: '#1B1B1B', highlight: '#FBE3E1', border: '#EBEBEB', onRed: '#FFFFFF',
};

// dark: nền tối, chữ sáng, vẫn giữ màu đỏ nhận diện của CLB
const darkPalette: Palette = {
  red: '#DA291C', dark: '#000000', gray: '#A3A3A3', light: '#121212', card: '#1E1E1E',
  text: '#F2F2F2', highlight: '#4A1F1C', border: '#2C2C2C', onRed: '#FFFFFF',
};

export const palettes = { light: lightPalette, dark: darkPalette };

// Giữ tên `theme` như tài liệu (bảng màu sáng) để tham chiếu nhanh
export const theme = lightPalette;

// Hook chọn bảng màu theo cài đặt Sáng/Tối của điện thoại
export function useColors(): Palette {
  return useColorScheme() === 'dark' ? darkPalette : lightPalette;
}
