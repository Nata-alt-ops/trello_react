import React, { useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TaskProps = {
  task: {
    id: number;
    title: string;
    tags: string[];
  };
  onEditTask: (taskId: number, newTitle: string) => void; //редактирование
  onDeleteTask: (taskId: number) => void; //удаление
  onToggleTag: (taskId: number, tag: string) => void; //теги
  cardId: number; //id карты где первоначально нахожилась карта
  activeDropdown: string | null; //смотрит какое меню открыто
  onDropdownToggle: (type: 'card' | 'task', id: number, e: any) => void; //переключение меню
  tags: string[];
}

export const Task = ({
    task,
    onEditTask,
    onDeleteTask,
    onToggleTag,
    cardId,
    activeDropdown,
    onDropdownToggle,
    tags
}: TaskProps) => {

    //состояния для редактирования задачи
    const [editTaskId, setEditTaskId] = useState<number | null>(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task: task,
            cardId: cardId
        }
    });
    // стили для перетаскивания
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    //редактирование задачи
    const handleTaskTitleClick = (e: any) => {
        e.stopPropagation();
        setEditTaskId(task.id);
        setEditTaskTitle(task.title);
    };

    //сохранения измененного текста задачи
    const saveTaskTitle = () => {
        if (editTaskTitle.trim() === '' || editTaskId === null) return;
        onEditTask(editTaskId, editTaskTitle.trim());
        setEditTaskId(null);
    };

    //сохраняет если переключаемся на что то другое
    const handleTaskInputBlur = () => {
        saveTaskTitle();
    };

    //сохранение когда мы нажимаем Enter
    const handleTaskKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            saveTaskTitle();
        }
    };

    // для меню
    const handleDropdownClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onDropdownToggle('task', task.id, e);
    };

    //для тегов
    const handleTagToggle = (tag: string, e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleTag(task.id, tag); //тут добавляем или удаляем ненужный тег
    };

    // удаление задачи
    const handleDeleteTask = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteTask(task.id);
    };

    // чтобы можно было переменовать и ничего не начало перемещаться 
    const handleInputClick = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className="task-item" 
        >
            <div className="task-header">
                <div className="task-tags">
                    {task.tags?.map((tag, index) => (
                        <span key={index} className={`task-tag ${tag.toLowerCase().replace(' ', '-')}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="task-content d-flex align-items-center justify-content-between">
                {editTaskId === task.id ? (
                    <div className="edit_input">
                        <input 
                            type="text"
                            value={editTaskTitle}
                            onChange={(e) => setEditTaskTitle(e.target.value)}
                            onBlur={handleTaskInputBlur}
                            onKeyDown={handleTaskKeyPress}
                            onClick={handleInputClick}
                            autoFocus
                        />
                    </div>
                ) : (
                    <span 
                        className="task-title"
                        onClick={handleTaskTitleClick}
                        style={{ cursor: 'pointer' }}
                        {...attributes}
                        {...listeners}
                    >
                        {task.title}
                    </span>
                )}
                <div className="task-options">
                    <div className="dropdown">
                        <button
                            className="btn btn-sm task-dropdown-btn"
                            type="button"
                            aria-expanded={activeDropdown === `task-${task.id}`}
                            onClick={handleDropdownClick}
                        >
                            •••
                        </button>
                        <div className={`dropdown-menu ${activeDropdown === `task-${task.id}` ? 'show' : ''}`}>
                            <div className="dropdown-menu-header">Добавить тег:</div>
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    className={`dropdown-item ${task.tags?.includes(tag) ? 'active' : ''}`}
                                    onClick={(e) => handleTagToggle(tag, e)}
                                    type="button"
                                >
                                    {tag}
                                    {task.tags?.includes(tag) && ' ✓'}
                                </button>
                            ))}
                            <hr className="dropdown-divider" />
                            <button
                                className="dropdown-item text-danger"
                                onClick={handleDeleteTask}
                                type="button"
                            >
                                Удалить задачу
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};