/**
 * Toast Helper Functions
 * Provides convenience functions for common toast scenarios using the UI component system
 */

import { ToastType } from '@/components/ui/Toast';

// Type for the toast function from useToast hook
export type ShowToastFunction = (type: ToastType, title: string, message?: string, duration?: number) => void;

/**
 * Show API error with appropriate message
 */
export const showApiError = (showToast: ShowToastFunction, error: unknown): void => {
  let title = 'Operación fallida';
  let message = 'Por favor intenta de nuevo más tarde';
  
  if (error instanceof Error) {
    title = 'Operación fallida';
    message = error.message;
    
    // Handle authentication errors specially
    if (message.includes('身份验证失败') || message.includes('Autenticación fallida') || message.includes('401')) {
      title = 'Autenticación fallida';
      message = 'Por favor inicia sesión de nuevo e intenta otra vez';
      // Show error with longer duration for auth issues
      showToast('error', title, message, 8000);
      return;
    }
    
    // Handle specific error types
    if (message.includes('网络连接失败') || message.includes('conexión de red') || message.includes('Network')) {
      title = 'Error de red';
      message = 'Por favor verifica la conexión de red e intenta de nuevo';
    } else if (message.includes('权限不足') || message.includes('Permisos insuficientes') || message.includes('403')) {
      title = 'Permisos insuficientes';
      message = 'No se puede realizar esta operación';
    } else if (message.includes('文件过大') || message.includes('demasiado grande') || message.includes('413')) {
      title = 'Archivo demasiado grande';
      message = 'Por favor selecciona un archivo más pequeño';
    } else if (message.includes('不支持的文件类型') || message.includes('Tipo de archivo no soportado') || message.includes('415')) {
      title = 'Tipo de archivo incorrecto';
      message = 'Tipo de archivo no soportado';
    } else if (message.includes('服务器') || message.includes('Error del servidor') || message.includes('500')) {
      title = 'Error del servidor';
      message = 'Servicio temporalmente no disponible, por favor intenta más tarde';
    }
  }
  
  showToast('error', title, message);
};

/**
 * Show network error
 */
export const showNetworkError = (showToast: ShowToastFunction): void => {
  showToast('error', 'Error de red', 'Fallo en la conexión de red, por favor verifica la conexión y vuelve a intentarlo');
};

/**
 * Show success message
 */
export const showSuccess = (showToast: ShowToastFunction, message: string, details?: string): void => {
  showToast('success', message, details);
};

/**
 * Show warning message
 */
export const showWarning = (showToast: ShowToastFunction, message: string, details?: string): void => {
  showToast('warning', message, details);
};

/**
 * Show info message
 */
export const showInfo = (showToast: ShowToastFunction, message: string, details?: string): void => {
  showToast('info', message, details);
};

/**
 * Show authentication error with special handling
 */
export const showAuthError = (showToast: ShowToastFunction, message?: string): void => {
  const title = 'Autenticación fallida';
  const authMessage = message || 'Por favor inicia sesión de nuevo e intenta otra vez';
  showToast('error', title, authMessage, 8000);
  
  // Log for potential redirect logic
  console.log('Authentication required - redirect to login if needed');
};

/**
 * Show file operation success
 */
export const showFileSuccess = (showToast: ShowToastFunction, operation: string, fileName: string): void => {
  const messages = {
    upload: 'Carga exitosa',
    delete: 'Eliminación exitosa',
    download: 'Descarga completada',
  };
  
  const title = messages[operation as keyof typeof messages] || 'Operación exitosa';
  showToast('success', title, `Archivo "${fileName}": ${title.toLowerCase()}`);
};

/**
 * Show file operation error
 */
export const showFileError = (showToast: ShowToastFunction, operation: string, fileName: string, error?: unknown): void => {
  const messages = {
    upload: 'Error al subir',
    delete: 'Error al eliminar',
    download: 'Descarga fallida',
  };
  
  const title = messages[operation as keyof typeof messages] || 'Operación fallida';
  let message = `Archivo "${fileName}" ${title}`;
  
  if (error instanceof Error) {
    message += `：${error.message}`;
  }
  
  showToast('error', title, message);
};

/**
 * Show knowledge base operation success
 */
export const showKnowledgeBaseSuccess = (showToast: ShowToastFunction, operation: string, name?: string): void => {
  const messages = {
    create: 'Creación exitosa',
    update: 'Actualización exitosa',
    delete: 'Eliminación exitosa',
  };
  
  const title = messages[operation as keyof typeof messages] || 'Operación exitosa';
  const message = name ? `Base de conocimiento "${name}" ${title}` : `Base de conocimiento${title}`;
  showToast('success', title, message);
};

/**
 * Show knowledge base operation error
 */
export const showKnowledgeBaseError = (showToast: ShowToastFunction, operation: string, error?: unknown, name?: string): void => {
  const messages = {
    create: 'Creación fallida',
    update: 'Actualización fallida',
    delete: 'Error al eliminar',
    load: 'Error al cargar',
  };
  
  const title = messages[operation as keyof typeof messages] || 'Operación fallida';
  let message = name ? `Base de conocimiento "${name}" ${title}` : `Base de conocimiento${title}`;
  
  if (error instanceof Error) {
    message += `：${error.message}`;
  }
  
  showToast('error', title, message);
};
