import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, './components'),
          '@hooks': path.resolve(__dirname, './hooks'),
          '@services': path.resolve(__dirname, './services'),
          '@lib': path.resolve(__dirname, './lib'),
          '@config': path.resolve(__dirname, './config'),
          '@contexts': path.resolve(__dirname, './contexts'),
          '@types': path.resolve(__dirname, './types'),
        }
      }
    };
});
