import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Confession, Category, Comment } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const useConfessions = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load confessions from Supabase
  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('confessions')
          .select(`
            *,
            comments (*)
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Transform dates from strings to Date objects
        const transformedData = data.map(confession => ({
          ...confession,
          createdAt: new Date(confession.created_at),
          expiresAt: new Date(confession.expires_at),
          comments: confession.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.created_at)
          }))
        }));

        setConfessions(transformedData);
      } catch (err) {
        setError('Failed to load confessions. Please try refreshing the page.');
        console.error('Error loading confessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfessions();

    // Subscribe to real-time changes
    const confessionsSubscription = supabase
      .channel('confessions_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'confessions' 
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setConfessions(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setConfessions(prev => prev.filter(c => c.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setConfessions(prev => prev.map(c => 
            c.id === payload.new.id ? { ...c, ...payload.new } : c
          ));
        }
      })
      .subscribe();

    return () => {
      confessionsSubscription.unsubscribe();
    };
  }, []);

  // Add a new confession
  const addConfession = async (
    content: string,
    category: Category,
    hasTriggerWarning: boolean = false,
    triggerWarningText?: string,
    imageUrl?: string
  ) => {
    try {
      const now = new Date();
      const expirationDate = new Date(now);
      expirationDate.setDate(now.getDate() + 30);

      const { data, error: insertError } = await supabase
        .from('confessions')
        .insert([{
          content,
          category,
          has_trigger_warning: hasTriggerWarning,
          trigger_warning_text: triggerWarningText,
          image_url: imageUrl,
          created_at: now.toISOString(),
          expires_at: expirationDate.toISOString(),
          support_count: 0,
          is_reported: false
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return data.id;
    } catch (err) {
      setError('Failed to add confession. Please try again.');
      console.error('Error adding confession:', err);
      return null;
    }
  };

  // Add a comment to a confession
  const addComment = async (confessionId: string, content: string) => {
    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([{
          confession_id: confessionId,
          content,
          created_at: new Date().toISOString(),
          support_count: 0
        }]);

      if (insertError) throw insertError;
    } catch (err) {
      setError('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
    }
  };

  // Support a confession
  const supportConfession = async (confessionId: string) => {
    try {
      // First, get the current support count
      const { data: currentData, error: fetchError } = await supabase
        .from('confessions')
        .select('support_count')
        .eq('id', confessionId)
        .single();

      if (fetchError) throw fetchError;

      const currentCount = currentData.support_count || 0;
      const newCount = currentCount + 1;

      // Then update with the new count
      const { error: updateError } = await supabase
        .from('confessions')
        .update({ support_count: newCount })
        .eq('id', confessionId);

      if (updateError) throw updateError;

      // Update local state
      setConfessions(prev => prev.map(c => 
        c.id === confessionId 
          ? { ...c, supportCount: newCount }
          : c
      ));
    } catch (err) {
      setError('Failed to add support. Please try again.');
      console.error('Error supporting confession:', err);
    }
  };

  // Support a comment
  const supportComment = async (confessionId: string, commentId: string) => {
    try {
      // First, get the current support count
      const { data: currentData, error: fetchError } = await supabase
        .from('comments')
        .select('support_count')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      const currentCount = currentData.support_count || 0;
      const newCount = currentCount + 1;

      // Then update with the new count
      const { error: updateError } = await supabase
        .from('comments')
        .update({ support_count: newCount })
        .eq('id', commentId);

      if (updateError) throw updateError;

      // Update local state
      setConfessions(prev => prev.map(c => ({
        ...c,
        comments: c.comments.map(com => 
          com.id === commentId
            ? { ...com, supportCount: newCount }
            : com
        )
      })));
    } catch (err) {
      setError('Failed to add support to comment. Please try again.');
      console.error('Error supporting comment:', err);
    }
  };

  // Report a confession
  const reportConfession = async (confessionId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('confessions')
        .update({ is_reported: true })
        .eq('id', confessionId);

      if (updateError) throw updateError;

      // Update local state
      setConfessions(prev => prev.map(c => 
        c.id === confessionId 
          ? { ...c, isReported: true }
          : c
      ));
    } catch (err) {
      setError('Failed to report confession. Please try again.');
      console.error('Error reporting confession:', err);
    }
  };

  // Filter confessions by category
  const filterByCategory = (category: Category | null) => {
    if (!category) return confessions;
    return confessions.filter(confession => confession.category === category);
  };

  // Search confessions by content
  const searchConfessions = (searchTerm: string) => {
    if (!searchTerm.trim()) return confessions;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return confessions.filter(
      confession => confession.content.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  return {
    confessions,
    isLoading,
    error,
    addConfession,
    addComment,
    supportConfession,
    supportComment,
    reportConfession,
    filterByCategory,
    searchConfessions,
  };
};