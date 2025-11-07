import { createEvent, sample } from 'effector';
import { $cards } from '../card/card';

export const deleteTask = createEvent<number>();

sample({
  clock: deleteTask,
  source: $cards,
  fn: (cards, taskId) =>
    cards.map(card => ({
      ...card,
      tasks: card.tasks.filter(task => task.id !== taskId)
    })),
  target: $cards
});