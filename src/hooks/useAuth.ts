'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { createPreferencesTableSQL, insertUserSQL, logSearchSQL, logReadSQL } from '@/utils/sql'

export type ActivityType = 'LOGIN' | 'SEARCH' | 'READ'

export interface UserData {
  id: string
  name: string
  email: string
  documentId: string
  avatarUrl: string
  role: 'admin' | 'owner' | 'user'
}

export interface UserActivity {
  id: string
  userId: string
  type: ActivityType
  subject: string
  timestamp: string
}

interface AuthContextValue {
  user: UserData | null
  history: UserActivity[]
  login: (name: string, email: string, password: string, documentId?: string, role?: 'admin' | 'user') => void
  logout: () => void
  updateProfile: (updates: Partial<UserData>) => void
  setUser: (userData: UserData | null) => void
  registerSearch: (query: string) => void
  registerRead: (bookId: string, title: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_USER = 'biblioteca-user'
const STORAGE_HISTORY = 'biblioteca-history'
const STORAGE_PROFILES = 'biblioteca-user-profiles'

function getProfileKey(user: { email?: string; documentId?: string }) {
  return user.email?.trim() || user.documentId?.trim() || ''
}

function loadSavedProfiles() {
  if (typeof window === 'undefined') return {} as Record<string, Partial<UserData>>
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_PROFILES) || '{}') as Record<string, Partial<UserData>>
  } catch {
    return {}
  }
}

function saveProfiles(profiles: Record<string, Partial<UserData>>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_PROFILES, JSON.stringify(profiles))
  } catch {}
}

function persistUserProfile(user: UserData) {
  const key = getProfileKey(user)
  if (!key) return
  const profiles = loadSavedProfiles()
  profiles[key] = {
    ...profiles[key],
    id: user.id,
    name: user.name,
    email: user.email,
    documentId: user.documentId,
    avatarUrl: user.avatarUrl,
    role: user.role,
  }
  saveProfiles(profiles)
}

function restoreUserProfile(email: string, documentId: string) {
  const profiles = loadSavedProfiles()
  const emailKey = email.trim()
  const documentKey = documentId.trim()
  return profiles[emailKey] || profiles[documentKey] || null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null)
  const [history, setHistory] = useState<UserActivity[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const storedUser = window.localStorage.getItem(STORAGE_USER)
      const storedHistory = window.localStorage.getItem(STORAGE_HISTORY)

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser({
          ...parsedUser,
          role: parsedUser?.role === 'owner' ? 'owner' : parsedUser?.role === 'admin' ? 'admin' : 'user',
        })
      }
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory))
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_USER, JSON.stringify(user))
      window.localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history))
    } catch {}
  }, [hydrated, user, history])

  const setUser = useCallback((nextUser: UserData | null) => {
    setUserState(nextUser)
    if (nextUser) {
      persistUserProfile(nextUser)
    }
  }, [])

  const login = useCallback((name: string, email: string, password: string, documentId: string = '', role: 'admin' | 'owner' | 'user' = 'user') => {
    const restored = restoreUserProfile(email.trim(), documentId.trim())
    const userData: UserData = {
      id: `${Date.now()}`,
      name: name.trim() || restored?.name || 'Usuario',
      email: email.trim(),
      documentId: documentId.trim() || restored?.documentId || `DOC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      avatarUrl: restored?.avatarUrl || `/avatar-${Math.floor(Math.random() * 6) + 1}.png`,
      role,
    }

    setUser(userData)

    const firstActivity: UserActivity = {
      id: `${Date.now()}-login`,
      userId: userData.id,
      type: 'LOGIN',
      subject: 'Inicio de sesión exitoso',
      timestamp: new Date().toISOString(),
    }

    setHistory((current) => [...current, firstActivity])

    console.info('SQL: ', insertUserSQL({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password,
      avatarUrl: userData.avatarUrl,
    }))
    console.info('SQL: ', createPreferencesTableSQL())
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates: Partial<UserData>) => {
    if (!user) return
    setUser({ ...user, ...updates })
  }, [user, setUser])

  const registerSearch = useCallback((query: string) => {
    if (!user) return
    const activity: UserActivity = {
      id: `${Date.now()}-search`,
      userId: user.id,
      type: 'SEARCH',
      subject: query,
      timestamp: new Date().toISOString(),
    }
    setHistory((current) => [...current, activity])
    console.info('SQL: ', logSearchSQL(user.id, query))
  }, [user])

  const registerRead = useCallback((bookId: string, title: string) => {
    if (!user) return
    const activity: UserActivity = {
      id: `${Date.now()}-read`,
      userId: user.id,
      type: 'READ',
      subject: title,
      timestamp: new Date().toISOString(),
    }
    setHistory((current) => [...current, activity])
    console.info('SQL: ', logReadSQL(user.id, bookId))
  }, [user])

  const value = useMemo(
    () => ({ user, history, login, logout, updateProfile, setUser, registerSearch, registerRead }),
    [user, history, login, logout, updateProfile, registerSearch, registerRead]
  )

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

