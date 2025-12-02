// src/utils/tailwindConfig.js
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigFile from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfigFile);

export const tailwindConfig = () => {
  return fullConfig;
};

export const getThemeColors = () => {
  return fullConfig.theme.colors;
};
