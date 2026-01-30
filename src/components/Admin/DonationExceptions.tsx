import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Exception {
    email: string;
    created_at: string;
}

const DonationExceptions: React.FC = () => {
    const [exceptions, setExceptions] = useState<Exception[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchExceptions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('donation_exceptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExceptions(data || []);
        } catch (err: any) {
            console.error('Error fetching exceptions:', err);
            // Don't show error if table doesn't exist yet, just empty list
            if (err.code === '42P01') { // undefined_table
                setError('Table "donation_exceptions" does not exist. Please run migration.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExceptions();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim()) return;

        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase
                .from('donation_exceptions')
                .insert([{ email: newEmail.trim() }]);

            if (error) throw error;

            setSuccess(`Added ${newEmail} to exceptions.`);
            setNewEmail('');
            fetchExceptions();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (email: string) => {
        if (!confirm(`Remove ${email} from exceptions?`)) return;

        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase
                .from('donation_exceptions')
                .delete()
                .eq('email', email);

            if (error) throw error;

            setSuccess(`Removed ${email}.`);
            setExceptions(prev => prev.filter(e => e.email !== email));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Donation Popup Exceptions</h3>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email to exempt..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                />
                <button
                    type="submit"
                    disabled={loading || !newEmail.trim()}
                    className="bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </form>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-xs text-green-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-4 text-white/30 text-xs">Loading...</div>
                ) : exceptions.length === 0 ? (
                    <div className="text-center py-4 text-white/30 text-xs italic">No exceptions found.</div>
                ) : (
                    exceptions.map((ex) => (
                        <div key={ex.email} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-colors">
                            <span className="text-sm text-slate-300 truncate">{ex.email}</span>
                            <button
                                onClick={() => handleDelete(ex.email)}
                                className="text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                title="Remove exception"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DonationExceptions;
