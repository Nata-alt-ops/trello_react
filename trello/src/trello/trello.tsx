// src/trello/Trello.tsx
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './trello.scss';

type Card = {
    id: number,
    title: string,
    tasks?: Task[]
}

type Task = {
    id: number,
    title: string,
    tags?: string[],
}

type Tag = {
    id: string,
    name: string
}

export const Trello = () => {
    const [card, setCard] = useState<Card[]>([
        {
            id: 1,
            title: 'Незавершенные',
            tasks: [
                { 
                    id: 1, 
                    title: 'Помыть кота', 
                    tags: ['Bug', 'Urgent']
                }
            ]
        },
        {
            id: 2,
            title: 'Готовые',
            tasks: []
        }
    ])
    
    const availableTags = ['Bug', 'Feature', 'Urgent', 'Low Priority', 'High Priority'];

    // удаление карточки
    const DeleteCard = (id: number) => {
        setCard(nCard => nCard.filter(card => card.id !== id))
    }

    // добавление карты
    const [newcard, setNewCard] = useState('');

    const addCard = () => {
        const newCard: Card = {
            id: card.length > 0 ? Math.max(...card.map(u => u.id)) + 1 : 1,
            title: `Card ${card.length + 1}`,
            tasks: []
        };
        setCard([...card, newCard]);
    };

    // перетаскивание карт
    const [draggedCard, setDraggedCard] = useState<number | null>(null);

    const handleDragStart = (id: number) => {
        setDraggedCard(id);
    };

    const handleDrop = (e: any, targetId: number) => {
        e.preventDefault();

        if (draggedCard === null || draggedCard === targetId) return;

        const newCardI = [...card];
        const draggedIndex = newCardI.findIndex(card => card.id === draggedCard);
        const targetIndex = newCardI.findIndex(card => card.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;
        
        const [movedCard] = newCardI.splice(draggedIndex, 1);
        newCardI.splice(targetIndex, 0, movedCard); 
        setCard(newCardI);
        setDraggedCard(null);
    }

    // перетаскивание задач между картами
    const [draggedTask, setDraggedTask] = useState<{taskId: number, sourceCardId: number} | null>(null);

    const handleTaskDragStart = (e: React.DragEvent, taskId: number, sourceCardId: number) => {
        e.stopPropagation();
        setDraggedTask({ taskId, sourceCardId });
    };

    const handleTaskDragOver = (e: React.DragEvent, targetCardId: number) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleTaskDrop = (e: React.DragEvent, targetCardId: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedTask) return;

        const { taskId, sourceCardId } = draggedTask;

        // Если задача переносится в ту же карту - ничего не делаем
        if (sourceCardId === targetCardId) {
            setDraggedTask(null);
            return;
        }

        // Находим задачу в исходной карте
        const sourceCard = card.find(c => c.id === sourceCardId);
        const taskToMove = sourceCard?.tasks?.find(t => t.id === taskId);

        if (!taskToMove) {
            setDraggedTask(null);
            return;
        }

        // Удаляем задачу из исходной карты и добавляем в целевую
        setCard(prev => 
            prev.map(cardItem => {
                if (cardItem.id === sourceCardId) {
                    // Удаляем задачу из исходной карты
                    return {
                        ...cardItem,
                        tasks: cardItem.tasks?.filter(task => task.id !== taskId) || []
                    };
                } else if (cardItem.id === targetCardId) {
                    // Добавляем задачу в целевую карту
                    return {
                        ...cardItem,
                        tasks: [...(cardItem.tasks || []), taskToMove]
                    };
                }
                return cardItem;
            })
        );

        setDraggedTask(null);
    };

    const handleTaskDropSameCard = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggedTask(null);
    };

    // редактирование заголовка карты
    const [editCardId, setEditCardId] = useState<number | null>(null);
    const [editCard, setEditCard] = useState('');

    const EditCardTitle = (card: Card) => {
        setEditCardId(card.id);
        setEditCard(card.title);
    }

    const SaveNewCardTitle = () => {
        if (editCard.trim() === '' || editCardId === null) return;

        setCard(prev =>
            prev.map(card => 
                card.id === editCardId ? {...card, title: editCard.trim()} : card
            )
        );
        setEditCardId(null)
    };

    const handleCardTitleClick = (cardItem: Card) => {
        EditCardTitle(cardItem);
    }

    const handleInputBlur = () => {
        SaveNewCardTitle();
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            SaveNewCardTitle();
        }
    };

    // редактирование задачи
    const [editTaskId, setEditTaskId] = useState<number | null>(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');

    const EditTaskTitle = (task: Task) => {
        setEditTaskId(task.id);
        setEditTaskTitle(task.title);
    }

    const SaveTaskTitle = () => {
        if (editTaskTitle.trim() === '' || editTaskId === null) return;

        setCard(prev =>
            prev.map(card => ({
                ...card,
                tasks: card.tasks?.map(task =>
                    task.id === editTaskId ? { ...task, title: editTaskTitle.trim() } : task
                ) || []
            }))
        );
        setEditTaskId(null);
    };

    const handleTaskTitleClick = (task: Task) => {
        EditTaskTitle(task);
    }

    const handleTaskInputBlur = () => {
        SaveTaskTitle();
    };

    const handleTaskKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            SaveTaskTitle();
        }
    };

    // управление тегами задачи
    const [showTagMenu, setShowTagMenu] = useState<number | null>(null);

    const toggleTag = (taskId: number, tag: string) => {
        setCard(prev =>
            prev.map(card => ({
                ...card,
                tasks: card.tasks?.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            tags: task.tags?.includes(tag)
                                ? task.tags.filter(t => t !== tag) // удаляем тег
                                : [...(task.tags || []), tag] // добавляем тег
                        }
                        : task
                ) || []
            }))
        );
    };

    const removeTag = (taskId: number, tag: string) => {
        setCard(prev =>
            prev.map(card => ({
                ...card,
                tasks: card.tasks?.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            tags: task.tags?.filter(t => t !== tag) || []
                        }
                        : task
                ) || []
            }))
        );
    };

    // добавление задачи
    const addTask = (cardId: number) => {
        const newTask: Task = {
            id: Date.now(),
            title: 'Новая задача',
            tags: []
        };

        setCard(prev =>
            prev.map(card =>
                card.id === cardId
                    ? { ...card, tasks: [...(card.tasks || []), newTask] }
                    : card
            )
        );
    };

    // удаление задачи
    const deleteTask = (cardId: number, taskId: number) => {
        setCard(prev =>
            prev.map(card =>
                card.id === cardId
                    ? { ...card, tasks: card.tasks?.filter(task => task.id !== taskId) || [] }
                    : card
            )
        );
        setShowTagMenu(null); // Закрываем меню после удаления
    };

    // закрытие меню при клике вне его
    const handleClickOutside = () => {
        setShowTagMenu(null);
    };

    return (
        <div className="trello_board" onClick={handleClickOutside}>
            <div className="trello_cards">
                {card.map((cardItem) => (
                    <div 
                        key={cardItem.id} 
                        className="card"
                        draggable
                        onDragStart={() => handleDragStart(cardItem.id)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            handleTaskDragOver(e, cardItem.id);
                        }}
                        onDrop={(e) => {
                            handleDrop(e, cardItem.id);
                            handleTaskDrop(e, cardItem.id);
                        }}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="card_header d-flex justify-content-between align-items-center flex-row">
                            <div className="card_title d-flex flex-row">
                                {editCardId === cardItem.id ? (
                                    <div className="edit_input">
                                        <input 
                                            type="text" 
                                            value={editCard} 
                                            onChange={(e) => setEditCard(e.target.value)}
                                            onBlur={handleInputBlur}
                                            onKeyDown={handleKeyPress}
                                            autoFocus
                                        />
                                    </div>
                                ) : ( 
                                    <h1 
                                        onClick={() => handleCardTitleClick(cardItem)}
                                    >
                                        {cardItem.title}
                                    </h1>
                                )}
                            </div>
                       
                            <div className="options">
                                <div className="dropdown">
                                    <button className="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none" viewBox="0 0 256 256"><path d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"></path></svg>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><div className="dropdown-item" onClick={(e) => { e.stopPropagation(); EditCardTitle(cardItem); }}>Переименовать</div></li>
                                        <li><div className="dropdown-item" onClick={(e) => { e.stopPropagation(); DeleteCard(cardItem.id); }}>Удалить</div></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Область для задач */}
                        <div className="tasks-area">
                            {/* Зона для приема перетаскиваемых задач */}
                            <div 
                                className="drop-zone"
                                onDragOver={(e) => handleTaskDragOver(e, cardItem.id)}
                                onDrop={(e) => handleTaskDrop(e, cardItem.id)}
                            ></div>
                            
                            {cardItem.tasks && cardItem.tasks.length > 0 ? (
                                <div className="tasks-list">
                                    {cardItem.tasks.map((task) => (
                                        <div 
                                            key={task.id} 
                                            className="task-item" 
                                            onClick={(e) => e.stopPropagation()}
                                            draggable
                                            onDragStart={(e) => handleTaskDragStart(e, task.id, cardItem.id)}
                                            onDragOver={(e) => handleTaskDragOver(e, cardItem.id)}
                                            onDrop={handleTaskDropSameCard}
                                        >
                                            {/* Теги задачи */}
                                            <div className="task-header">
                                                <div className="task-tags">
                                                    {task.tags?.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className={`task-tag ${tag.toLowerCase().replace(' ', '-')}`}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                
                                            </div>

                                            {/* Текст задачи */}
                                            <div className="task-content d-flex align-items-center justify-content-between">
                                                {editTaskId === task.id ? (
                                                    <div className="edit_input">
                                                    <input
                                                        type="text"
                                                        value={editTaskTitle}
                                                        onChange={(e) => setEditTaskTitle(e.target.value)}
                                                        onBlur={handleTaskInputBlur}
                                                        onKeyDown={handleTaskKeyPress}
                                                        autoFocus
                                                        
                                                    />
                                                    </div>
                                                ) : (
                                                    <span
                                                        className="task-title"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTaskTitleClick(task);
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    >
                                                        {task.title}
                                                    </span>
                                                )}
                                                <div className="task-options">
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-sm task-dropdown-btn"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            •••
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li><div className="dropdown-menu-header">Добавить тег:</div></li>
                                                            {availableTags.map(tag => (
                                                                <li key={tag}>
                                                                    <div 
                                                                        className={`dropdown-item ${task.tags?.includes(tag) ? 'active' : ''}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleTag(task.id, tag);
                                                                        }}
                                                                    >
                                                                        {tag}
                                                                        {task.tags?.includes(tag) && ' ✓'}
                                                                    </div>
                                                                </li>
                                                            ))}
                                                            <li><hr className="dropdown-divider" /></li>
                                                            <li>
                                                                <div 
                                                                    className="dropdown-item text-danger"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteTask(cardItem.id, task.id);
                                                                    }}
                                                                >
                                                                    Удалить задачу
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-tasks">
                                    <p>Задач пока нет</p>
                                </div>
                            )}
                        </div>

                        {/* Кнопка добавления задачи */}
                        <div className="add-task-footer d-flex ">
                            <button
                                className="btn  add-task-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addTask(cardItem.id);
                                }}
                            >
                                + Добавить задачу
                            </button>
                        </div>
                    </div>
                ))}
                <div className="add_card">
                    <button onClick={addCard}>Добавить карту</button>
                </div>
            </div>
        </div>
    )
};