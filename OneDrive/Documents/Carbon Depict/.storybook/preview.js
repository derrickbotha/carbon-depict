import '../src/styles/globals.css';
import '../src/styles/tokens.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#111827',
        },
        {
          name: 'greenly-surface',
          value: '#F9FAFB',
        },
      ],
    },
    layout: 'padded',
  },
};

export default preview;