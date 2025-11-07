import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './trello.scss';
import { Card } from "./Card";

// Импорты для dnd
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

// Effector импорты
import { useStore } from 'effector-react';
import { 
    $cards, 
    moveCard,
    deleteCard,
    editCard,
    addCard
} from "./model/card";
import { 
    $tags, 
    moveTask,
    deleteTask,
    toggleTag,
    addTask,
    editTask
} from './model/task';
import { 
    $activeDropdown, 
    dropdownToggled 
} from "./ui";
import type { CardType } from "./model/card/card";
import type { Task } from "./model/task/task";

export const Trello = () => {
    const cards = useStore($cards);
    const tags = useStore($tags);
    const activeDropdown = useStore($activeDropdown);

    // Dnd-kit состояния для карт и задач
    const [activeCard, setActiveCard] = useState<CardType | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // для управления на разных устройствах
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Перемещение карт
    const handleCardDragStart = (event: any) => {
        setActiveCard(event.active.data.current?.card);
    };

    const handleCardDragEnd = (event: any) => {
        const { active, over } = event;
        
        if (!over) {
            setActiveCard(null);
            return;
        }

        if (active.id !== over.id) {
            moveCard({ activeId: active.id, overId: over.id });
        }

        setActiveCard(null);
    };

    // Перемещение задач
    const handleTaskDragStart = (event: any) => {
        setActiveTask(event.active.data.current?.task);
    };

    const handleTaskDragEnd = (event: any) => {
        const { active, over } = event;
        
        if (!over) {
            setActiveTask(null);
            return;
        }

        const activeTaskData = active.data.current?.task;
        const overCardId = over.data.current?.cardId;

        if (!activeTaskData) {
            setActiveTask(null);
            return;
        }

        const sourceCardId = active.data.current?.cardId;

        if (over.data.current?.type === 'card') {
            const targetCardId = over.id;
            moveTask({
                activeId: active.id,
                overId: over.id,
                sourceCardId,
                targetCardId
            });
        } else {
            const targetCardId = overCardId;

            if (sourceCardId === targetCardId) {
                const sourceCard = cards.find(c => c.id === sourceCardId);
                if (sourceCard?.tasks) {
                    const tasks = sourceCard.tasks;
                    const oldIndex = tasks.findIndex(task => task.id === active.id);
                    const newIndex = tasks.findIndex(task => task.id === over.id);

                    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        moveTask({
                            activeId: active.id,
                            overId: over.id,
                            sourceCardId,
                            targetCardId,
                            targetIndex: newIndex
                        });
                    }
                }
            } else {
                const targetCard = cards.find(c => c.id === targetCardId);
                let targetIndex = targetCard?.tasks?.length || 0;
                
                if (over.data.current?.task) {
                    targetIndex = targetCard?.tasks?.findIndex(task => task.id === over.id) || 0;
                }
                
                moveTask({
                    activeId: active.id,
                    overId: over.id,
                    sourceCardId,
                    targetCardId,
                    targetIndex
                });
            }
        }

        setActiveTask(null);
    };

    const handleEditCard = (cardId: number, newTitle: string) => {
        editCard({ cardId, newTitle });
    };

    const handleEditTask = (taskId: number, newTitle: string) => {
        editTask({ taskId, newTitle });
    };

    const handleToggleTag = (taskId: number, tag: string) => {
        toggleTag({ taskId, tag });
    };

    const handleDropdownToggle = (type: 'card' | 'task', id: number, e: any) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownToggled({ type, id });
    };

    //анимация перемещения
    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className="trello_board">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(event) => {
                    if (event.active.data.current?.type === 'card') {
                        handleCardDragStart(event);
                    } else if (event.active.data.current?.type === 'task') {
                        handleTaskDragStart(event);
                    }
                }}
                onDragEnd={(event) => {
                    if (event.active.data.current?.type === 'card') {
                        handleCardDragEnd(event);
                    } else if (event.active.data.current?.type === 'task') {
                        handleTaskDragEnd(event);
                    }
                }}
            >
                <SortableContext 
                    items={cards.map(card => card.id)} 
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="trello_cards">
                        {cards.map((cardItem) => (
                            <Card
                                key={cardItem.id}
                                card={cardItem}
                                onDeleteCard={deleteCard}
                                onEditCardTitle={handleEditCard}
                                onAddTask={addTask}
                                onEditTask={handleEditTask}
                                onDeleteTask={deleteTask}
                                onToggleTag={handleToggleTag}
                                activeDropdown={activeDropdown}
                                onDropdownToggle={handleDropdownToggle}
                                tags={tags}
                            />
                        ))}
                        <div className="add_card">
                            <button onClick={() => addCard()}>+</button>
                        </div>
                    </div>
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeCard ? (
                        <div className="card" style={{ 
                            opacity: 0.8,
                            transform: 'rotate(0deg)',
                            cursor: 'grabbing',
                        }}>
                            <div className="card_header d-flex justify-content-between align-items-center flex-row">
                                <div className="card_title">
                                    <h1>{activeCard.title}</h1>
                                </div>
                            </div>
                        </div>
                    ) : activeTask ? (
                        <div className="task-item" style={{ 
                            opacity: 0.8,
                            transform: 'rotate(0deg)',
                            cursor: 'grabbing',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}>
                            <div className="task-content d-flex align-items-center justify-content-between">
                                <span className="task-title">{activeTask.title}</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};