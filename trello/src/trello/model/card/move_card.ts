import { createEvent, sample } from "effector";
import { $cards } from "./card";

export const moveCard = createEvent<{ activeId: number; overId: number}>();

sample({
    clock: moveCard,
    source: $cards,
    fn: (cards, { activeId, overId }) => {
        const oldIndex = cards.findIndex(card => card.id === activeId);
        const newIndex = cards.findIndex(card => card.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const newCards = [...cards];
            const [movedCard] = newCards.splice(oldIndex, 1);
            newCards.splice(newIndex, 0, movedCard);
            return newCards;
        }
        return cards;
    },
    target: $cards
});