import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationsContext = createContext<any>(null);

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const show = (msg: string, options?: { severity?: 'success' | 'error' | 'info' | 'warning', autoHideDuration?: number }) => {
    setMessage(msg);
    setSeverity(options?.severity || 'info');
    setTimeout(() => setMessage(null), options?.autoHideDuration || 3000);
  };

  return (
    <NotificationsContext.Provider value={{ show }}>
      {children}
      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage(null)}>
        <Alert severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationsContext.Provider>
  );
}
