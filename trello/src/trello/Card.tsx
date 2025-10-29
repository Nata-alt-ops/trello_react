import React, { useState } from "react";
import { Task } from "./Task";

export const Card = ({
    card,
    onDeleteCard,
    onEditCardTitle,
    onAddTask,
    onDragStart,
    onDrop,
    onTaskDragStart,
    onTaskDrop,
    onTaskDragOver,
    onEditTask,
    onDeleteTask,
    onToggleTag,
    activeDropdown,
    onDropdownToggle,
    tags
}:any) => {
    const [editCardId, setEditCardId] = useState(null);
    const [editCardTitle, setEditCardTitle] = useState('');

    const handleCardTitleClick = () => {
        setEditCardId(card.id);
        setEditCardTitle(card.title);
    };

    const saveCardTitle = () => {
        if (editCardTitle.trim() === '' || editCardId === null) return;
        onEditCardTitle(editCardId, editCardTitle.trim());
        setEditCardId(null);
    };

    const handleInputBlur = () => {
        saveCardTitle();
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            saveCardTitle();
        }
    };

    const handleTaskDropSameCard = (e: any, taskId?: number) => {
        onTaskDrop(e, card.id, taskId);
    };

    return (
        <div 
            className="card" 
            draggable
            onDragStart={() => onDragStart(card.id)}
            onDragOver={(e) => {
                e.preventDefault();
                onTaskDragOver(e, card.id);
            }}
            onDrop={(e) => {
                onDrop(e, card.id);
                onTaskDrop(e, card.id);
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="card_header d-flex justify-content-between align-items-center flex-row">
                <div className="card_title d-flex flex-row">
                    {editCardId === card.id ? (
                        <div className="edit_input">
                            <input 
                                type="text" 
                                value={editCardTitle} 
                                onChange={(e) => setEditCardTitle(e.target.value)}
                                onBlur={handleInputBlur}
                                onKeyDown={handleKeyPress}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <h1 onClick={handleCardTitleClick}>{card.title}</h1>
                    )}
                </div>
                <div className="options">
                    <div className="dropdown">
                        <button 
                            type="button" 
                            aria-expanded={activeDropdown === `card-${card.id}`}
                            onClick={(e) => onDropdownToggle('card', card.id, e)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none" viewBox="0 0 256 256">
                                <path d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"></path>
                            </svg>
                        </button>
                        <ul className={`dropdown-menu ${activeDropdown === `card-${card.id}` ? 'show' : ''}`}>
                            <li>
                                <div 
                                    className="dropdown-item" 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        onDeleteCard(card.id); 
                                    }}
                                >
                                    Удалить
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="tasks_area">
                <div 
                    className="drop"
                    onDragOver={(e) => onTaskDragOver(e, card.id)}
                    onDrop={(e) => onTaskDrop(e, card.id)}
                ></div>
                {card.tasks && card.tasks.length > 0 ? (
                    <div className="tasks-list">
                        {card.tasks.map((task:any) => (
                            <Task
                                key={task.id}
                                task={task}
                                onEditTask={onEditTask}
                                onDeleteTask={onDeleteTask}
                                onToggleTag={onToggleTag}
                                onDragStart={onTaskDragStart}
                                onDrop={handleTaskDropSameCard}
                                onDragOver={onTaskDragOver}
                                cardId={card.id}
                                activeDropdown={activeDropdown}
                                onDropdownToggle={(taskId:any, e:any) => onDropdownToggle('task', taskId, e)}
                                tags={tags}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-tasks">
                        <p>Добавьте задачи</p>
                    </div>
                )}
            </div>
            <div className="add-task-footer d-flex">
                <button
                    className="add-task-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddTask(card.id);
                    }}
                >
                    + Добавить задачу
                </button>
            </div>
        </div>
    );
};