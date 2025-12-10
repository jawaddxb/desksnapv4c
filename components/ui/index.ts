/**
 * Shared UI Components
 *
 * Re-exports all UI components for easy importing.
 * Usage: import { IconButton, Slider, Menu } from '@components/ui';
 */

export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { Slider } from './Slider';
export type { SliderProps } from './Slider';

export { Divider } from './Divider';
export type { DividerProps } from './Divider';

export {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuHeader,
  Submenu,
} from './Menu';
export type {
  MenuProps,
  MenuItemProps,
  MenuHeaderProps,
  SubmenuProps,
} from './Menu';
