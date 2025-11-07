import { createEvent, sample } from 'effector';
import { $cards } from '../card/card';

export const moveTask = createEvent<{
  activeId: number;
  overId: number;
  sourceCardId: number;
  targetCardId: number;
  targetIndex?: number;
}>();

sample({
  clock: moveTask,
  source: $cards,
  fn: (cards, { activeId, overId, sourceCardId, targetCardId, targetIndex }) => {
    
    if (sourceCardId === targetCardId) {
      return cards.map(card => {
        if (card.id === sourceCardId) {
          const tasks = [...card.tasks];
          const oldIndex = tasks.findIndex(task => task.id === activeId);
          
         
          let newIndex: number;
          if (targetIndex !== undefined) {
            newIndex = targetIndex;
          } else {
            newIndex = tasks.findIndex(task => task.id === overId);
          }
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const [movedTask] = tasks.splice(oldIndex, 1);
            const adjustedIndex = oldIndex < newIndex ? newIndex - 1 : newIndex;
            tasks.splice(adjustedIndex, 0, movedTask);
            
            return { ...card, tasks };
          }
        }
        return card;
      });
    } 
    else {
      const sourceCard = cards.find(card => card.id === sourceCardId);
      const taskToMove = sourceCard?.tasks.find(task => task.id === activeId);
      
      if (!taskToMove) return cards;

      return cards.map(card => {
        if (card.id === sourceCardId) {
          return {
            ...card,
            tasks: card.tasks.filter(task => task.id !== activeId)
          };
        } else if (card.id === targetCardId) {
          const newTasks = [...card.tasks];
          let insertIndex: number;
          
          if (targetIndex !== undefined) {
            insertIndex = targetIndex;
          } else if (overId) {
            insertIndex = newTasks.findIndex(task => task.id === overId);
            if (insertIndex === -1) {
              insertIndex = newTasks.length;
            }
          } else {
            insertIndex = newTasks.length;
          }
          
          newTasks.splice(insertIndex, 0, taskToMove);
          return {
            ...card,
            tasks: newTasks
          };
        }
        return card;
      });
    }
  },
  target: $cards
});