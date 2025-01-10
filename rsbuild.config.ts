import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    title: 'Davide Ghiotto',
  },
  plugins: [pluginReact()],
});
