import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WebApp from '@twa-dev/sdk';
import { supabase } from '../utils/supabase';
import { Task } from '../types/game';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskCard = styled.div<{ completed: boolean }>`
  background: var(--tg-theme-secondary-bg-color);
  border-radius: 12px;
  padding: 16px;
  opacity: ${props => props.completed ? 0.7 : 1};
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const TaskReward = styled.div`
  color: var(--tg-theme-button-color);
  font-weight: bold;
`;

const TaskDescription = styled.p`
  margin: 8px 0;
  font-size: 14px;
  color: var(--tg-theme-hint-color);
`;

const CompleteButton = styled.button<{ completed: boolean }>`
  background: ${props => props.completed ? 'var(--tg-theme-hint-color)' : 'var(--tg-theme-button-color)'};
  color: var(--tg-theme-button-text-color);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: ${props => props.completed ? 'default' : 'pointer'};
  width: 100%;
`;

const TaskIcon = {
  youtube: '📺',
  telegram_group: '👥',
  telegram_channel: '📢',
  airdrop: '🎁'
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    subscribeToTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Fetch tasks and user completion status
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          user_tasks!inner(
            completed,
            completed_at
          )
        `)
        .eq('user_tasks.user_id', WebApp.initDataUnsafe.user.id);

      if (tasksError) throw tasksError;

      setTasks(tasksData.map(task => ({
        id: task.id,
        type: task.type,
        title: task.title,
        description: task.description,
        reward: task.reward,
        completed: task.user_tasks[0]?.completed || false,
        requirements: task.requirements
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      WebApp.showPopup({
        title: 'Error',
        message: 'Failed to load tasks. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTasks = () => {
    const userTasksSubscription = supabase
      .channel('user_tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_tasks',
          filter: `user_id=eq.${WebApp.initDataUnsafe.user.id}`
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userTasksSubscription);
    };
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setLoading(true);

      // Verify task requirements (example for YouTube task)
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      if (task.type === 'youtube') {
        // Here you would implement YouTube verification
        // For example, checking if user watched the video
        // using YouTube Data API
      } else if (task.type === 'telegram_group') {
        // Check if user is member of the group using Telegram Bot API
        const groupId = task.requirements.groupId;
        // Implement group membership check
      }

      // Update task completion status
      const { error } = await supabase
        .from('user_tasks')
        .upsert({
          user_id: WebApp.initDataUnsafe.user.id,
          task_id: taskId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user's earned tokens
      const { error: updateError } = await supabase
        .from('users')
        .update({
          total_earned: supabase.sql`total_earned + ${task.reward}`
        })
        .eq('id', WebApp.initDataUnsafe.user.id);

      if (updateError) throw updateError;

      WebApp.HapticFeedback.impactOccurred('medium');
      WebApp.showPopup({
        title: 'Task Completed!',
        message: `You earned ${task.reward} GNOME tokens!`
      });
    } catch (error) {
      console.error('Error completing task:', error);
      WebApp.showPopup({
        title: 'Error',
        message: 'Failed to complete task. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <Container>
      <h2>Daily Tasks</h2>
      <TaskList>
        {tasks.map(task => (
          <TaskCard key={task.id} completed={task.completed}>
            <TaskHeader>
              <TaskTitle>
                {TaskIcon[task.type]} {task.title}
              </TaskTitle>
              <TaskReward>+{task.reward} GNOME</TaskReward>
            </TaskHeader>
            <TaskDescription>{task.description}</TaskDescription>
            <CompleteButton
              completed={task.completed}
              onClick={() => !task.completed && handleCompleteTask(task.id)}
            >
              {task.completed ? 'Completed ✓' : 'Complete Task'}
            </CompleteButton>
          </TaskCard>
        ))}
      </TaskList>
    </Container>
  );
};

export default Tasks;
