import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((note) => {
        let Icon = Info;
        let color = '#06B6D4'; // cyan for info
        
        if (note.type === 'success') {
          Icon = CheckCircle;
          color = '#34d399'; // green
        } else if (note.type === 'error') {
          Icon = AlertCircle;
          color = '#fb7185'; // red
        }

        return (
          <div key={note.id} className="toast glass-card animate-toast-in">
            <Icon size={20} color={color} className="toast-icon" />
            <p className="toast-message">{note.message}</p>
            <button className="toast-close" onClick={() => removeNotification(note.id)}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
