import { createEvent, sample } from "effector";
import { $cards } from "./card";
import { randomId } from "./card";

export const addCard = createEvent();

sample({
    clock: addCard,
    source: $cards,
    fn: (cards) => [
        ...cards,
        {
            id: randomId(),
            title: `Card ${cards.length + 1}`,
            tasks: []
        }
    ],
    target: $cards
});