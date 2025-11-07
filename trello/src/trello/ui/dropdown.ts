import { createEvent, createStore } from 'effector';

export const setActiveDropdown = createEvent<string | null>();
export const dropdownToggled = createEvent<{ type: 'card' | 'task'; id: number }>();

export const $activeDropdown = createStore<string | null>(null)
  .on(setActiveDropdown, (_, id) => id)
  .on(dropdownToggled, (current, { type, id }) => {
    const dropdownId = `${type}-${id}`;
    return current === dropdownId ? null : dropdownId;
  });