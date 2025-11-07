import { createStore } from "effector";
import { Task } from "../task/task";

export type CardType = {
    id:number;
    title: string;
    tasks: Task[]
}

export const randomId = () =>{
    return Date.now()+ Math.floor(Math.random()* 10000)
}

export const $cards = createStore<CardType[]>([
     {
            id: randomId(),
            title: 'To do',
            tasks: [
                { 
                    id: randomId(), 
                    title: 'Суши', 
                    tags: ['Bug', 'Overdue', 'Urgent', 'Low Priority', 'High Priority']
                },
                { 
                    id: randomId(), 
                    title: 'Онигири', 
                    tags: ['Low Priority']
                }
            ]
        },
        {
            id: randomId(),
            title: 'Done',
            tasks: [
                { 
                    id: randomId(), 
                    title: 'Шаурма', 
                    tags: ['High Priority']
                },
            ]
        },
        {
            id: randomId(),
            title: ' Well',
            tasks: [
                { 
                    id: randomId(), 
                    title: 'Тыквенны крем-суп', 
                    tags: ['High Priority']
                },
            ]
        },
        {
            id: randomId(),
            title: 'Good',
            tasks: [
                { 
                    id: randomId(), 
                    title: 'Куринный суп', 
                    tags: ['High Priority']
                },
            ]
        },
         {
            id: randomId(),
            title: 'Well Done',
            tasks: [
                { 
                    id: randomId(), 
                    title: 'Пельмени', 
                    tags: ['High Priority']
                },
            ]
        },
         {
            id: randomId(),
            title: 'Well Done +',
            tasks: [
                { 
                    id: randomId(), 
                    title: 'Чизбургер', 
                    tags: ['High Priority']
                },
            ]
        }
])

