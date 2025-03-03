import WebApp from '@twa-dev/sdk';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string = message
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorCodes = {
  INIT_FAILED: 'INIT_FAILED',
  AUTH_FAILED: 'AUTH_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TASK_VERIFICATION_FAILED: 'TASK_VERIFICATION_FAILED',
  WALLET_CONNECTION_FAILED: 'WALLET_CONNECTION_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const;

export const handleError = (error: unknown) => {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    WebApp.showPopup({
      title: 'Error',
      message: error.userMessage
    });
    return;
  }

  if (error instanceof Error) {
    // Handle network errors
    if (error.message.includes('network') || error.message.includes('Network')) {
      WebApp.showPopup({
        title: 'Connection Error',
        message: 'Please check your internet connection and try again.'
      });
      return;
    }

    // Handle authentication errors
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      WebApp.showPopup({
        title: 'Authentication Error',
        message: 'Please restart the app and try again.'
      });
      return;
    }
  }

  // Default error message
  WebApp.showPopup({
    title: 'Error',
    message: 'An unexpected error occurred. Please try again.'
  });
};

export const throwAppError = (code: keyof typeof errorCodes, message: string) => {
  throw new AppError(message, code);
};
