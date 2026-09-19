'use client';
import { usePathname } from 'next/navigation';
export const PublicOnly = ({ children }) => usePathname()?.startsWith('/admin') ? null : children;