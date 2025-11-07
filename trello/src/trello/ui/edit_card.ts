import { createEvent, createStore, sample } from 'effector';
import { editCard } from '../model/card';

export const cardTitleEditStarted = createEvent<{ cardId: number; title: string }>();
export const cardTitleEditEnded = createEvent();

export const $editCardId = createStore<number | null>(null)
  .on(cardTitleEditStarted, (_, { cardId }) => cardId)
  .on(cardTitleEditEnded, () => null);

export const $editCardTitle = createStore<string>('')
  .on(cardTitleEditStarted, (_, { title }) => title)
  .on(cardTitleEditEnded, () => '');

sample({
  clock: cardTitleEditEnded,
  source: { cardId: $editCardId, title: $editCardTitle },
  filter: ({ cardId, title }) => cardId !== null && title.trim() !== '',
  fn: ({ cardId, title }) => ({ cardId: cardId!, newTitle: title.trim() }),
  target: editCard
});