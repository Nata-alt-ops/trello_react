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

        const newCard: Card = {
            id:card.length > 0 ? Math.max(...card.map(u => u.id))+1:1,
            title: `Card ${card.length + 1}`
        };
        setCard([...card, newCard]);
    };

    //перетаскивание карт
    const[draggedCard, setDraggedCard] = useState<number | null>(null);

    const handleDragStart = (id: number) => {
        setDraggedCard(id);
    };

    const handleDrop = (e:any, targetId: number) =>{
        e.preventDefault();

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

    //редактирование заголовка карты
    const [editCardId, setEditCardId] = useState<number | null>(null);
    const [editCard, setEditCard] = useState('');

    const EditCardTitle = (card: Card) =>{
        setEditCardId(card.id);
        setEditCard(card.title);
    }

    const SaveNewCardTitle = () => {
        if (editCard.trim() === '' || editCardId === null ) return;

        setCard(prev =>
            prev.map(card => 
                card.id === editCardId ? {...card, title:editCard.trim()}:card
            )
        );
        setEditCardId(null)
    };

 return(
    <div className="trello_board">
        <div className="add_card">
            <button onClick={addCard}>Добавить карту</button>
        </div>
        <div className="trello_cards">
            {card.map((cardItem) =>(
                <div key={cardItem.id} 
                
                className="card"
                draggable
                onDragStart={() => handleDragStart(cardItem.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, cardItem.id)}
                >
                    <div className="card_header d-flex justify-content-between align-items-center flex-row">
                        <div className="drag_title d-flex flex-row">
                            {editCardId === cardItem.id ? (
                                <div className="edit-input">
                                <input type="text" value={editCard} onChange={(e) => setEditCard(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter'){
                                        e.preventDefault();
                                        e.stopPropagation();
                                        SaveNewCardTitle();}}}/>
                                <button onClick={(e) => {e.stopPropagation(); SaveNewCardTitle();}}>Изменить</button></div>
                            ): ( <h1>{cardItem.title}</h1>)}
                        </div>
                       
                        <div className="options" >
                            <div className="dropdown">
                                <button className="btn btn-secondary " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">

                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); EditCardTitle(cardItem)}}>Переменовать</div>
                                    <div className="dropdown-item" onClick={(e) => {e.stopPropagation(); DeleteCard(cardItem.id);}}>Удалить </div>
                                </ul>
                            </div>
                        </div>
                        </div>
                </div>
            ))}
        </div>
    </div>
 )
};