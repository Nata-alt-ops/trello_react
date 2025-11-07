import { createEvent, sample, createStore } from 'effector';
import { $cards } from '../card/card';

export const toggleTag = createEvent<{taskId: number, tag: string}>();
export const $tags = createStore<string[]>([
  'Bug', 'Overdue', 'Urgent', 'Low Priority', 'High Priority']);

sample({
  clock: toggleTag,
  source: $cards,
  fn: (cards, { taskId, tag }) =>
    cards.map(card => ({
      ...card,
      tasks: card.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              tags: task.tags.includes(tag)
                ? task.tags.filter(t => t !== tag)
                : [...task.tags, tag]
            }
          : task
      )
    })),
  target: $cards
});