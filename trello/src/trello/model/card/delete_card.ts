import { createEvent, sample } from "effector";
import { $cards } from "./card";

export const deleteCard = createEvent<number>();

sample({
    clock: deleteCard,
    source: $cards,
    fn: (cards, id) => cards.filter(card => card.id !== id),
    target: $cards
});