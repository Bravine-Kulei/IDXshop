import React, { createContext, useContext, useState } from 'react';

interface RecentlyViewedContextType {
  items: any[];
  addToRecentlyViewed: (product: any) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

interface RecentlyViewedProviderProps {
  children: React.ReactNode;
}

export const RecentlyViewedProvider: React.FC<RecentlyViewedProviderProps> = ({ children }) => {
  const [items, setItems] = useState<any[]>([]);

  const addToRecentlyViewed = (product: any) => {
    // TODO: Implement recently viewed functionality
    console.log('Add to recently viewed:', product);
  };

  const value: RecentlyViewedContextType = {
    items,
    addToRecentlyViewed
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
