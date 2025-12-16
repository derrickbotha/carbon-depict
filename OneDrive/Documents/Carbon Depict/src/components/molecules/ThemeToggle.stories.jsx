/**
 * ThemeToggle Storybook Stories
 *
 * Demonstrates all variants and states of the ThemeToggle component
 */
import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { AppStateProvider } from '../../contexts/AppStateContext'

export default {
  title: 'Molecules/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <AppStateProvider>
        <div className="p-8 bg-bg-primary min-h-screen">
          <Story />
        </div>
      </AppStateProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
ThemeToggle is an accessible theme switcher component that allows users to cycle through theme preferences:
- **Light Mode**: Force light theme
- **Dark Mode**: Force dark theme
- **System**: Auto-detect from OS settings

The component automatically updates when the system theme changes (when set to 'system' mode).

## Accessibility
- Fully keyboard accessible
- ARIA labels describe current state
- Focus indicators meet WCAG standards
- Respects prefers-reduced-motion

## Usage
\`\`\`jsx
import { ThemeToggle } from './components/molecules/ThemeToggle'

// Basic usage
<ThemeToggle />

// With label
<ThemeToggle showLabel />

// Compact variant
<ThemeToggle variant="compact" size="sm" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the toggle button',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show text label alongside icon',
    },
    variant: {
      control: 'select',
      options: ['button', 'compact'],
      description: 'Visual variant of the toggle',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
}

/**
 * Default ThemeToggle with icon only
 */
export const Default = {
  args: {},
}

/**
 * ThemeToggle with text label
 * Label shows current theme and detected system theme (when in system mode)
 */
export const WithLabel = {
  args: {
    showLabel: true,
  },
}

/**
 * Compact variant for tight spaces (e.g., navbars, toolbars)
 */
export const Compact = {
  args: {
    variant: 'compact',
  },
}

/**
 * Small size variant
 */
export const Small = {
  args: {
    size: 'sm',
    showLabel: true,
  },
}

/**
 * Medium size (default)
 */
export const Medium = {
  args: {
    size: 'md',
    showLabel: true,
  },
}

/**
 * Large size variant
 */
export const Large = {
  args: {
    size: 'lg',
    showLabel: true,
  },
}

/**
 * Multiple toggles in a row
 * Demonstrates different sizes and variants together
 */
export const Variants = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ThemeToggle size="sm" variant="compact" />
      <ThemeToggle size="md" variant="compact" />
      <ThemeToggle size="lg" variant="compact" />
      <div className="w-full h-px bg-border-primary my-2" />
      <ThemeToggle size="sm" showLabel />
      <ThemeToggle size="md" showLabel />
      <ThemeToggle size="lg" showLabel />
    </div>
  ),
}

/**
 * In a navigation bar context
 */
export const InNavbar = {
  render: () => (
    <nav className="bg-bg-secondary border-b border-border-primary px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-text-primary">Carbon Depict</h1>
          <div className="hidden md:flex items-center gap-4 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary">Dashboard</a>
            <a href="#" className="hover:text-text-primary">Reports</a>
            <a href="#" className="hover:text-text-primary">Settings</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary">
            Help
          </button>
          <ThemeToggle variant="compact" />
        </div>
      </div>
    </nav>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ThemeToggle integrated into a navigation bar, using the compact variant to save space.',
      },
    },
  },
}

/**
 * Accessibility test - Keyboard navigation
 */
export const AccessibilityDemo = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-bg-secondary rounded-lg">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Keyboard Navigation</h3>
        <p className="text-sm text-text-secondary mb-4">
          Use <kbd className="px-2 py-1 bg-bg-tertiary rounded text-xs">Tab</kbd> to focus and{' '}
          <kbd className="px-2 py-1 bg-bg-tertiary rounded text-xs">Enter</kbd> or{' '}
          <kbd className="px-2 py-1 bg-bg-tertiary rounded text-xs">Space</kbd> to toggle.
        </p>
        <ThemeToggle showLabel />
      </div>

      <div className="p-4 bg-bg-secondary rounded-lg">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Screen Reader Support</h3>
        <p className="text-sm text-text-secondary mb-4">
          The button has an ARIA label that announces the current theme state.
        </p>
        <ThemeToggle showLabel />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including keyboard navigation and screen reader support.',
      },
    },
  },
}
