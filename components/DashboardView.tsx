import React, { useEffect, useState } from 'react';
import { AuthResponse, Task } from '../types';
import { authService } from '../services/authService';
import { taskService } from '../services/taskService';
import { Button } from './Button';
import { TaskModal } from './TaskModal';

interface DashboardViewProps {
  session: AuthResponse;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ session, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks(session.user.id);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user.id]);

  const handleCreateOrUpdate = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await taskService.updateTask({ ...editingTask, ...taskData } as Task);
      } else {
        await taskService.createTask({
            ...taskData as any,
            userId: session.user.id
        });
      }
      await fetchTasks();
    } catch (e) {
      console.error(e);
      alert('Error al guardar la tarea');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'completed') return t.status === 'completed';
    return t.status !== 'completed';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-check"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">MicroTask</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              Hola, <span className="font-semibold text-slate-900">{session.user.fullName}</span>
            </span>
            <Button variant="ghost" onClick={async () => {
              await authService.logout();
              onLogout();
            }}>
              <i className="fas fa-sign-out-alt mr-2"></i>
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mis Tareas</h2>
            <p className="text-slate-500 text-sm mt-1">
              Gestiona tus actividades diarias
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>Todas</button>
                <button onClick={() => setFilter('pending')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${filter === 'pending' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>Pendientes</button>
                <button onClick={() => setFilter('completed')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${filter === 'completed' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>Completadas</button>
             </div>
            <Button onClick={openCreateModal} className="flex-1 sm:flex-none whitespace-nowrap">
              <i className="fas fa-plus mr-2"></i> Nueva
            </Button>
          </div>
        </div>

        {/* Task Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl h-48 animate-pulse shadow-sm border border-slate-200"></div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
             <div className="text-slate-300 mb-4 text-5xl">
               <i className="fas fa-clipboard-list"></i>
             </div>
             <h3 className="text-lg font-medium text-slate-900">No hay tareas encontradas</h3>
             <p className="text-slate-500 text-sm mb-6">Comienza creando una nueva tarea.</p>
             <Button variant="secondary" onClick={openCreateModal}>Crear Tarea</Button>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <div key={task.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button onClick={() => openEditModal(task)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                            <i className="fas fa-pen"></i>
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">{task.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {task.description}
                  </p>
                </div>
                <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
                  <span><i className="far fa-clock mr-1"></i> {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreateOrUpdate}
        initialData={editingTask}
      />
    </div>
  );
};