import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './trello.scss';
import { Card } from "./Card";

export const Trello = () => {
    const randomId = () => Date.now() + Math.floor(Math.random() * 10000);

    const [cards, setCards] = useState([
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
        }
    ]);

    const tags = ['Bug', 'Overdue', 'Urgent', 'Low Priority', 'High Priority'];
    const [draggedCard, setDraggedCard] = useState<number | null>(null);
    const [draggedTask, setDraggedTask] = useState<{taskId: number, sourceCardId: number} | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Card functions
    const deleteCard = (id: number) => {
        setCards(cards => cards.filter(card => card.id !== id));
    };

    const addCard = () => {
        const newCard = {
            id: randomId(),
            title: `Card ${cards.length + 1}`,
            tasks: []
        };
        setCards([...cards, newCard]);
    };

    const editCardTitle = (cardId: number, newTitle: string) => {
        setCards(prev =>
            prev.map(card => 
                card.id === cardId ? {...card, title: newTitle} : card
            )
        );
    };

    const handleDragStart = (id: number) => {
        setDraggedCard(id);
    };

    const handleDrop = (e: any, targetId: number) => {
        e.preventDefault();
        if (draggedCard === null || draggedCard === targetId) return;

        const newCards = [...cards];
        const draggedIndex = newCards.findIndex(card => card.id === draggedCard);
        const targetIndex = newCards.findIndex(card => card.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;
        
        const [movedCard] = newCards.splice(draggedIndex, 1);
        newCards.splice(targetIndex, 0, movedCard); 
        setCards(newCards);
        setDraggedCard(null);
    };

    // Task functions
    const addTask = (cardId: number) => {
        const newTask = {
            id: randomId(),
            title: 'Новая задача',
            tags: []
        };

        setCards(prev =>
            prev.map(card =>
                card.id === cardId
                    ? { ...card, tasks: [...(card.tasks || []), newTask] }
                    : card
            )
        );
    };

    const deleteTask = (taskId: number) => {
        setCards(prev =>
            prev.map(card => ({
                ...card,
                tasks: card.tasks?.filter(task => task.id !== taskId) || []
            }))
        );
    };

    const editTask = (taskId: number, newTitle: string) => {
        setCards(prev =>
            prev.map(card => ({
                ...card,
                tasks: card.tasks?.map(task =>
                    task.id === taskId ? { ...task, title: newTitle } : task
                ) || []
            }))
        );
    };

    const toggleTag = (taskId: number, tag: string) => {
        setCards(prev =>
            prev.map(card => ({
                ...card,
                tasks: card.tasks?.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            tags: task.tags?.includes(tag)
                                ? task.tags.filter(t => t !== tag) 
                                : [...(task.tags || []), tag] 
                        }
                        : task
                ) || []
            }))
        );
    };

    const handleTaskDragStart = (e: any, taskId: number, sourceCardId: number) => {
        e.stopPropagation();
        setDraggedTask({ taskId, sourceCardId });
    };

    const handleTaskDragOver = (e: any, cardId: number) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleTaskDrop = (e: any, targetCardId: number, targetTaskId?: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedTask) return;
        const { taskId, sourceCardId } = draggedTask;

        if (sourceCardId === targetCardId) {
            // Move within same card
            setCards(prev => 
                prev.map(cardItem => {
                    if (cardItem.id === sourceCardId && cardItem.tasks) {
                        const tasks = [...cardItem.tasks];
                        const draggedIndex = tasks.findIndex(task => task.id === taskId);
                        
                        if (draggedIndex === -1) return cardItem;
                        
                        const [movedTask] = tasks.splice(draggedIndex, 1);
                        
                        if (targetTaskId) {
                            let targetIndex = tasks.findIndex(task => task.id === targetTaskId);
                            if (targetIndex !== -1) {
                                tasks.splice(targetIndex, 0, movedTask);
                            } else {
                                tasks.push(movedTask);
                            }
                        } else {
                            tasks.push(movedTask);
                        }
                        
                        return { ...cardItem, tasks };
                    }
                    return cardItem;
                })
            );
        } else {
            // Move between cards
            const sourceCard = cards.find(c => c.id === sourceCardId);
            const taskToMove = sourceCard?.tasks?.find(t => t.id === taskId);

            if (!taskToMove) {
                setDraggedTask(null);
                return;
            }
            
            setCards(prev => 
                prev.map(cardItem => {
                    if (cardItem.id === sourceCardId) {
                        return {
                            ...cardItem,
                            tasks: cardItem.tasks?.filter(task => task.id !== taskId) || []
                        };
                    } else if (cardItem.id === targetCardId) {
                        return {
                            ...cardItem,
                            tasks: [...(cardItem.tasks || []), taskToMove]
                        };
                    }
                    return cardItem;
                })
            );
        }

        setDraggedTask(null);
    };

    const handleDropdownToggle = (type: 'card' | 'task', id: number, e: any) => {
        e.stopPropagation();
        const dropdownId = `${type}-${id}`;
        setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
    };

    const handleClickOutside = () => {
        setActiveDropdown(null);
    };

    return (
        <div className="trello_board" onClick={handleClickOutside}>
            <div className="trello_cards">
                {cards.map((cardItem) => (
                    <Card
                        key={cardItem.id}
                        card={cardItem}
                        onDeleteCard={deleteCard}
                        onEditCardTitle={editCardTitle}
                        onAddTask={addTask}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onTaskDragStart={handleTaskDragStart}
                        onTaskDrop={handleTaskDrop}
                        onTaskDragOver={handleTaskDragOver}
                        onEditTask={editTask}
                        onDeleteTask={deleteTask}
                        onToggleTag={toggleTag}
                        activeDropdown={activeDropdown}
                        onDropdownToggle={handleDropdownToggle}
                        tags={tags}
                    />
                ))}
                <div className="add_card">
                    <button onClick={addCard}>+</button>
                </div>
            </div>
        </div>
    );
};