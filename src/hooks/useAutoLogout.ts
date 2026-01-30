import { useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

// 15 minutes in milliseconds
const IDLE_TIMEOUT = 15 * 60 * 1000;

export const useAutoLogout = () => {
    const timerRef = useRef<any>(null);

    useEffect(() => {
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        const resetTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(async () => {
                // Check if user is actually logged in before signing out to avoid unnecessary calls
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    console.log('User idle for too long. Logging out...');
                    await supabase.auth.signOut();
                    alert('You have been logged out due to inactivity.');
                }
            }, IDLE_TIMEOUT);
        };

        // Initialize timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);
};
