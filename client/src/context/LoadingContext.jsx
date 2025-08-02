import React, { createContext, useContext, useState } from 'react';
import Loader from '../components/Loader';

const LoadingContext = createContext();

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showGlobalLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setGlobalLoading(true);
  };

  const hideGlobalLoading = () => {
    setGlobalLoading(false);
    setLoadingMessage('Loading...');
  };

  const withGlobalLoading = async (asyncFunction, message = 'Loading...') => {
    try {
      showGlobalLoading(message);
      const result = await asyncFunction();
      return result;
    } finally {
      hideGlobalLoading();
    }
  };

  return (
    <LoadingContext.Provider value={{
      globalLoading,
      loadingMessage,
      showGlobalLoading,
      hideGlobalLoading,
      withGlobalLoading
    }}>
      {children}
      {globalLoading && (
        <div className="loader-fullpage">
          <Loader size="large" text={loadingMessage} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}; 