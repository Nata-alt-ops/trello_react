import { createEvent, sample } from "effector";
import { $cards } from "./card";

export const editCard = createEvent<{ cardId: number; newTitle: string}>();

sample({
    clock: editCard,
    source: $cards,
    fn: (cards, { cardId, newTitle}) =>
        cards.map(card => 
            card.id === cardId ? {...card, title: newTitle } : card
        ),
    target: $cards
});