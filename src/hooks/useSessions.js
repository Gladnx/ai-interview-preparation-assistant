import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/react'
import { supabase } from '../lib/supabase'

export function useSessions() {
  const { user } = useUser()
  const userId = user?.id

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  // Load sessions from Supabase
  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSessions(data)
        setLoading(false)
      })
  }, [userId])

  const addSession = useCallback(async (sessionData) => {
    const row = {
      user_id: userId,
      role: sessionData.role,
      company: sessionData.company || null,
      job_description: sessionData.jobDescription,
      resume_name: sessionData.resumeName,
      resume_text: sessionData.resumeText || null,
      status: 'pending',
      question_count: 0,
    }
    const { data, error } = await supabase
      .from('sessions')
      .insert(row)
      .select()
      .single()

    if (error) throw error
    setSessions((prev) => [data, ...prev])
    return data
  }, [userId])

  const updateSession = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    setSessions((prev) => prev.map((s) => s.id === id ? data : s))
    return data
  }, [userId])

  const deleteSession = useCallback(async (id) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }, [userId])

  const getSession = useCallback((id) => {
    return sessions.find((s) => s.id === id) ?? null
  }, [sessions])

  return { sessions, loading, addSession, updateSession, deleteSession, getSession }
}
