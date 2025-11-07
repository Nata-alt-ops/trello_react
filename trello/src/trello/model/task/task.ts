import { $cards } from "../card/card";

export type Task = {
    id: number;
    title: string;
    tags: string[];
}

export const $tasks = $cards.map(cards => 
    cards.flatMap(card => card.tasks)
);

export const $tasksByCard = $cards.map(cards => 
    cards.reduce((acc, card) => {
        acc[card.id] = card.tasks;
        return acc;
    }, {} as Record<number, Task[]>)
);