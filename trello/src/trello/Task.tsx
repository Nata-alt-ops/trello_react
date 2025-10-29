import React, { useState } from "react";

export const Task = ({
    task,
    onEditTask,
    onDeleteTask,
    onToggleTag,
    onDragStart,
    onDrop,
    onDragOver,
    cardId,
    activeDropdown,
    onDropdownToggle,
    tags
}:any) => {
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');

    const handleTaskTitleClick = (task:any) => {
        setEditTaskId(task.id);
        setEditTaskTitle(task.title);
    };

    const saveTaskTitle = () => {
        if (editTaskTitle.trim() === '' || editTaskId === null) return;
        onEditTask(editTaskId, editTaskTitle.trim());
        setEditTaskId(null);
    };

    const handleTaskInputBlur = () => {
        saveTaskTitle();
    };

    const handleTaskKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            saveTaskTitle();
        }
    };

    return (
        <div 
            className="task-item" 
            onClick={(e) => e.stopPropagation()}
            draggable
            onDragStart={(e) => onDragStart(e, task.id, cardId)}
            onDragOver={(e) => onDragOver(e, cardId)}
            onDrop={(e) => onDrop(e, task.id)}
        >
            <div className="task-header">
                <div className="task-tags">
                    {task.tags?.map((tag:any, index:any) => (
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
                            aria-expanded={activeDropdown === `task-${task.id}`}
                            onClick={(e) => onDropdownToggle(task.id, e)}
                        >
                            •••
                        </button>
                        <ul className={`dropdown-menu ${activeDropdown === `task-${task.id}` ? 'show' : ''}`}>
                            <li><div className="dropdown-menu-header">Добавить тег:</div></li>
                            {tags.map((tag:any) => (
                                <li key={tag}>
                                    <div 
                                        className={`dropdown-item ${task.tags?.includes(tag) ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleTag(task.id, tag);
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
                                        onDeleteTask(task.id);
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
    );
};