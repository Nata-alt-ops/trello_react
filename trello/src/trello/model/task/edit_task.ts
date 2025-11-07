import { createEvent, sample } from 'effector';
import { $cards } from '../card/card';

export const editTask = createEvent<{ taskId: number; newTitle: string }>();

sample({
  clock: editTask,
  source: $cards,
  fn: (cards, { taskId, newTitle }) =>
    cards.map(card => ({
      ...card,
      tasks: card.tasks.map(task =>
        task.id === taskId ? { ...task, title: newTitle } : task
      )
    })),
  target: $cards
});