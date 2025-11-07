import { createEvent, createStore, sample } from 'effector';
import { editTask } from '../model/task';

export const taskTitleEditStarted = createEvent<{ taskId: number; title: string }>();
export const taskTitleEditEnded = createEvent();

export const $editTaskId = createStore<number | null>(null)
  .on(taskTitleEditStarted, (_, { taskId }) => taskId)
  .on(taskTitleEditEnded, () => null);

export const $editTaskTitle = createStore<string>('')
  .on(taskTitleEditStarted, (_, { title }) => title)
  .on(taskTitleEditEnded, () => '');

sample({
  clock: taskTitleEditEnded,
  source: { taskId: $editTaskId, title: $editTaskTitle },
  filter: ({ taskId, title }) => taskId !== null && title.trim() !== '',
  fn: ({ taskId, title }) => ({ taskId: taskId!, newTitle: title.trim() }),
  target: editTask
});