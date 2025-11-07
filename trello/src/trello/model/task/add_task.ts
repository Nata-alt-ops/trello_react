import { createEvent, sample } from 'effector';
import { $cards } from '../card/card';
import { randomId } from '../card/card';

export const addTask = createEvent<number>();

sample({
  clock: addTask,
  source: $cards,
  fn: (cards, cardId) =>
    cards.map(card =>
      card.id === cardId
        ? { 
            ...card, 
            tasks: [...card.tasks, {
              id: randomId(),
              title: 'Новая задача',
              tags: []
            }]
          }
        : card
    ),
  target: $cards
});