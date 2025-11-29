import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { GoogleGenAI } from "@google/genai";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => Promise<void>;
  initialData?: Task;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('pending');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setStatus(initialData.status);
      } else {
        setTitle('');
        setDescription('');
        setStatus('pending');
      }
    }
  }, [isOpen, initialData]);

  const handleGenerateDescription = async () => {
    if (!title) return;
    setIsGenerating(true);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
          // Fallback if no key is present in this mocked env
          setDescription("AI generation requires an API Key. Please describe: " + title);
          return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a concise, professional task description (max 3 sentences) for a task titled: "${title}". Use an active voice.`,
      });
      
      if (response.text) {
        setDescription(response.text.trim());
      }
    } catch (e) {
      console.error("AI Error:", e);
      setDescription("Could not generate description automatically.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...initialData,
        title,
        description,
        status
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Revisar documentación"
            required
            autoFocus
          />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Descripción</label>
              {process.env.API_KEY && (
                 <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={!title || isGenerating}
                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    <i className={`fas fa-magic ${isGenerating ? 'animate-pulse' : ''}`}></i>
                    {isGenerating ? 'Generando...' : 'Generar con IA'}
                  </button>
              )}
            </div>
            <textarea 
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none bg-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles de la tarea..."
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Estado</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['pending', 'in_progress', 'completed'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded uppercase tracking-wide transition-all ${
                    status === s 
                    ? s === 'completed' ? 'bg-green-500 text-white shadow' : s === 'in_progress' ? 'bg-yellow-500 text-white shadow' : 'bg-slate-500 text-white shadow'
                    : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" isLoading={isSaving}>Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};