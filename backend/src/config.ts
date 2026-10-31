import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 3000),
  fdToken: process.env.FOOTBALL_DATA_TOKEN ?? '',
  teamId: 66, // Manchester United trên football-data.org (xác nhận ở A1)
  csvTeamName: 'Man United', // tên đội trong file CSV lịch sử
  fplShort: 'MUN', // mã viết tắt của MU trong FPL
};
