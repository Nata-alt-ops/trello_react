import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './trello.scss';
import { Card } from "./Card";

//импорты для dnd
import{
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    } 
from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
} 
from '@dnd-kit/sortable';

type Task = {
  id: number;
  title: string;
  tags: string[];
}

type CardType = {
  id: number;
  title: string;
  tasks: Task[];
}

export const Trello = () => {
    //рандомные числа для id
    const randomId = () => {
        return Date.now() + Math.floor(Math.random() * 10000);
    };

    //тестовые данные
    const [cards, setCards] = useState<CardType[]>([
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
    ]);

    //теги
    const tags = ['Bug', 'Overdue', 'Urgent', 'Low Priority', 'High Priority'];
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    
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

    // Закрытие выпадающего списка при клике вне 
    useEffect(() => {
      const handleClickOutside = () => {
        setActiveDropdown(null);
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);

    // Основные функции для карт
    const deleteCard = (id: number) => {
        setCards(cards => cards.filter(card => card.id !== id));
    };

    const addCard = () => {
        const newCard: CardType = {
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

    // Основные функции для задач
    //добавление
    const addTask = (cardId: number) => {
        const newTask: Task = {
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
    //удаление
    const deleteTask = (taskId: number) => {
        setCards(prev =>
            prev.map(card => ({
                ...card,
                tasks: card.tasks?.filter(task => task.id !== taskId) || []
            }))
        );
    };
    //редактирование
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
    //теги
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
            setCards((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
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
        const overTaskData = over.data.current?.task;
        const overCardId = over.data.current?.cardId;

        if (!activeTaskData) {
            setActiveTask(null);
            return;
        }

        const sourceCardId = active.data.current?.cardId;

        if (over.data.current?.type === 'card') {
       
            const targetCardId = over.id;

            if (sourceCardId !== targetCardId) {
                setCards(prev => 
                    prev.map(card => {
                        if (card.id === sourceCardId) {
                            return {
                                ...card,
                                tasks: card.tasks?.filter(task => task.id !== active.id) || []
                            };
                        } else if (card.id === targetCardId) {
                            return {
                                ...card,
                                tasks: [...(card.tasks || []), activeTaskData]
                            };
                        }
                        return card;
                    })
                );
            }
        } else {
            const targetCardId = overCardId;

            if (sourceCardId === targetCardId) {
             
                setCards(prev => 
                    prev.map(card => {
                        if (card.id === sourceCardId && card.tasks) {
                            const tasks = [...card.tasks];
                            const oldIndex = tasks.findIndex(task => task.id === active.id);
                            const newIndex = tasks.findIndex(task => task.id === over.id);

                            if (oldIndex !== -1 && newIndex !== -1) {
                                return { ...card, tasks: arrayMove(tasks, oldIndex, newIndex) };
                            }
                        }
                        return card;
                    })
                );
            } else {
                const sourceCard = cards.find(c => c.id === sourceCardId);
                const taskToMove = sourceCard?.tasks?.find(t => t.id === active.id);
                const targetCard = cards.find(c => c.id === targetCardId);

                if (!taskToMove || !targetCard) {
                    setActiveTask(null);
                    return;
                }
                let targetIndex = targetCard.tasks?.length || 0;
                
                if (overTaskData) {
                    targetIndex = targetCard.tasks?.findIndex(task => task.id === over.id) || 0;
                }
                setCards(prev => 
                    prev.map(card => {
                        if (card.id === sourceCardId) {
                            
                            return {
                                ...card,
                                tasks: card.tasks?.filter(task => task.id !== active.id) || []
                            };
                        } else if (card.id === targetCardId) {
                            
                            const newTasks = [...(card.tasks || [])];
                            newTasks.splice(targetIndex, 0, taskToMove);
                            return {
                                ...card,
                                tasks: newTasks
                            };
                        }
                        return card;
                    })
                );
            }
        }

        setActiveTask(null);
    };

    //чтобы выпадающее меню в картах или задач открывалось/закрывалось
    const handleDropdownToggle = (type: 'card' | 'task', id: number, e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const dropdownId = `${type}-${id}`;
        setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
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
                                onEditCardTitle={editCardTitle}
                                onAddTask={addTask}
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