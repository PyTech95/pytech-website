'use client';
import { createContext, useContext } from 'react';
import useSWR from 'swr';
import { apiUrl } from '@/lib/api-client';
const ServiceContext = createContext([]);
export const contentFetcher = async (url) => { const r = await fetch(apiUrl(url)); if (!r.ok) throw new Error('Content unavailable'); return r.json(); };
export const ContentProvider = ({ services, children }) => {
  const { data } = useSWR('/api/services', contentFetcher, { fallbackData: { services } });
  return <ServiceContext.Provider value={data?.services || []}>{children}</ServiceContext.Provider>;
};
export const useServices = () => useContext(ServiceContext);