import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      outDir: 'dist',
      include: ['src'],
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json'
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@mint/slot-machine',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '' // optional shared SCSS vars
      }
    }
  }
});
