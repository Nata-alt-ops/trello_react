import React, { useState } from "react";
import { Task } from "./Task";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type TaskType = {
  id: number;
  title: string;
  tags: string[];
}

type CardProps = {
  card: {
    id: number;
    title: string;
    tasks: TaskType[];
  };
  onDeleteCard: (id: number) => void; //удаление
  onEditCardTitle: (cardId: number, newTitle: string) => void; //редактирование
  onAddTask: (cardId: number) => void; //добавление новой задачи
  onEditTask: (taskId: number, newTitle: string) => void; //редактирование задачи
  onDeleteTask: (taskId: number) => void; //удаление задачи
  onToggleTag: (taskId: number, tag: string) => void; //теги
  activeDropdown: string | null; 
  onDropdownToggle: (type: 'card' | 'task', id: number, e: any) => void; //переключение меню
  tags: string[]; //доступные теги
}

export const Card = ({
    card,
    onDeleteCard,
    onEditCardTitle,
    onAddTask,
    onEditTask,
    onDeleteTask,
    onToggleTag,
    activeDropdown,
    onDropdownToggle,
    tags
}: CardProps) => {

    //состояния для редактирования заголовка карты
    const [editCardId, setEditCardId] = useState<number | null>(null);
    const [editCardTitle, setEditCardTitle] = useState('');

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'card',
            card: card
        }
    });
    //стили для перемещения
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    //редактирование карты
    const handleCardTitleClick = (e: any) => {
        e.stopPropagation(); // чтобы не сработало перемещение
        setEditCardId(card.id);
        setEditCardTitle(card.title);
    };

    //сохранения исправленного заголовка карты
    const saveCardTitle = () => {
        if (editCardTitle.trim() === '' || editCardId === null) return;
        onEditCardTitle(editCardId, editCardTitle.trim());
        setEditCardId(null);
    };

    //сохранения заголовка когда переключается на что то другое
    const handleInputBlur = () => {
        saveCardTitle();
    };

    // сохранения по кнопке Enter
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            saveCardTitle();
        }
    };

    //открытие/закрытие выпадающего меню
    const handleDropdownClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onDropdownToggle('card', card.id, e);
    };

    //удаление карты
    const handleDeleteCard = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteCard(card.id);
    };

    //добавления задач
    const handleAddTask = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTask(card.id);
    };
    //чтобы можно было спокойно переменовать и ничего не начало перемещаться 
    const handleInputClick = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className="card" 
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
                                onClick={handleInputClick}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <h1 
                            onClick={handleCardTitleClick}
                            style={{ cursor: 'pointer' }}
                            {...attributes}
                            {...listeners}
                        >
                            {card.title}
                        </h1>
                    )}
                </div>
                <div className="options">
                    <div className="dropdown">
                        <button 
                            type="button" 
                            className=""
                            aria-expanded={activeDropdown === `card-${card.id}`}
                            onClick={handleDropdownClick} 
                            style={{fontSize:'10px'}}
                        >
                            •••
                        </button>
                        <div className={`dropdown-menu ${activeDropdown === `card-${card.id}` ? 'show' : ''}`}>
                            <button 
                                className="dropdown-item" 
                                onClick={handleDeleteCard}
                                type="button"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="tasks_area">
            {card.tasks && card.tasks.length > 0 ? (
                <div className="tasks-list">
                    <SortableContext 
                        items={card.tasks.map(task => task.id)} 
                        strategy={verticalListSortingStrategy}
                    >
                        {card.tasks.map((task) => (
                            <Task
                                key={task.id}
                                task={task}
                                cardId={card.id}
                                onEditTask={onEditTask}
                                onDeleteTask={onDeleteTask}
                                onToggleTag={onToggleTag}
                                activeDropdown={activeDropdown}
                                onDropdownToggle={onDropdownToggle}
                                tags={tags}
                            />
                        ))}
                    </SortableContext>
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
                    onClick={handleAddTask}
                >
                    + Добавить задачу
                </button>
            </div>
        </div>
    );
};