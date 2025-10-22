// src/trello/Trello.tsx
import React, { use, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './trello.scss';

type Card ={
    id:number,
    title: string,
    tasks?: Task[]
}

type Task ={
    id:number,
    title:string,
    tag?:string,
}

type Tag ={
    id:string,
    name:string
}

export const Trello = () => {
    const[card, setCard] = useState<Card[]>(
        [
            {
                id:1,
                title:'To do',
                tasks: []
            },
            {
                id:2,
                title:'Done',
                tasks: []
            }
        ]
    )

    //удаление карточки
    const DeleteCard = (id: number) => {
        setCard(nCard => nCard.filter(card => card.id !== id))
    }

    //добавление карты
    const[newcard, setNewCard] = useState('');

    const addCard =() =>{
        if (newcard.trim() === '') return;

        const newCard: Card = {
            id:card.length > 0 ? Math.max(...card.map(u => u.id))+1:1,
            title:newcard.trim()
        };
        setCard([...card, newCard]);
        setNewCard('')
    };

    //перетаскивание карт
    const[draggedCard, setDraggedCard] = useState<number | null>(null);

    const handleDragStart = (id: number) => {
        setDraggedCard(id);
    };

    const handleDrop = (e:any, targetId: number) =>{
        e.preventDefailt();

        if (draggedCard === null || draggedCard === targetId) return;

        const newCardI = [...card];
        const draggedIndex = newCardI.findIndex(card => card.id === draggedCard);
        const targetIndex = newCardI.findIndex(card => card.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;
        
        const [movedCard] = newCardI.splice(draggedIndex, 1);
        newCardI.splice(targetId, 0, movedCard);

        setCard(newCardI);
        setDraggedCard(null);
    }

 return(
    <div className="trello_board">
        <div className="add_card">
            <button onClick={addCard}>Добавить карту</button>
        </div>
        <div className="trello_cards">
            {card.map((card, cardIndex) =>(
                <div key={card.id}
                className="card">
                    <div className="card_header d-flex justify-content-between align-items-center flex-row">
                        <div className="drag_title d-flex flex-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#000000" viewBox="0 0 256 256"><path d="M188,82a25.85,25.85,0,0,0-14.59,4.49A26,26,0,0,0,128,75.41,26,26,0,0,0,82,92v22H68a26,26,0,0,0-26,26v12a86,86,0,0,0,172,0V108A26,26,0,0,0,188,82Zm14,70a74,74,0,0,1-148,0V140a14,14,0,0,1,14-14H82v26a6,6,0,0,0,12,0V92a14,14,0,0,1,28,0v28a6,6,0,0,0,12,0V92a14,14,0,0,1,28,0v28a6,6,0,0,0,12,0V108a14,14,0,0,1,28,0Z">
                                </path></svg>
                            <h1>{card.title}</h1>
                        </div>
                       
                        <div className="options"  onClick={(e) => {e.stopPropagation(); DeleteCard(card.id);}}>
                            ...
                        </div>
                        </div>
                </div>
            ))}
        </div>
    </div>
 )
};