export const jwtConstants = {
  secret: process.env.JWT_ACCESS_KEY || 'uzairways-secret-key-2024',
  expiresIn: process.env.JWT_ACCESS_TIME || '24h',
  refreshSecret: process.env.JWT_REFRESH_KEY || 'uzairways-refresh-secret-2024',
  refreshExpiresIn: process.env.JWT_REFRES_TIME || '7d',
};
