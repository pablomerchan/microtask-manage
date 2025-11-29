import React, { useState } from 'react';
import { authService } from '../services/authService';
import { AuthResponse } from '../types';
import { Button } from './Button';
import { Input } from './Input';

interface AuthViewProps {
  onSuccess: (session: AuthResponse) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response: AuthResponse;
      if (isLogin) {
        response = await authService.login(formData.username, formData.password);
      } else {
        if (!formData.fullName) throw new Error('El nombre completo es requerido');
        response = await authService.register(formData.username, formData.fullName, formData.password);
      }
      onSuccess(response);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">MicroTask</h1>
          <p className="text-blue-100">Gestor de Tareas & Microservicios</p>
        </div>
        
        <div className="p-8">
          <div className="flex gap-4 mb-6 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <Input 
                label="Nombre Completo"
                placeholder="Ej. Juan Pérez"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                required={!isLogin}
              />
            )}
            
            <Input 
              label="Usuario"
              placeholder="Ej. usuario123"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              required
            />

            <Input 
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isLogin ? 'Ingresar' : 'Crear Cuenta'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};