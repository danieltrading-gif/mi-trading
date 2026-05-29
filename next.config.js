/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Esto es un filtro: le decimos a webpack que ignore los archivos de test de la librería
    config.module.rules.push({
      test: /node_modules\/yahoo-finance2\/.*\/tests\//,
      use: 'null-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
