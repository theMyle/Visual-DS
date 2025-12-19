'use client';

import { useEffect, ReactNode } from 'react';
import { db } from './db';

interface DatabaseProviderProps {
    children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    useEffect(() => {
        try {
            // Open the database to trigger initialization
            db.open().catch((error) => {
                console.error('Failed to initialize database:', error);
            });
            console.log(`Using db: ${db.name}`);
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    }, []);

    return <>{children}</>;
}
