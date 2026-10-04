import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { firebaseErrorMessage } from '../firebase/errors'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  clearError: () => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function requireAuth() {
  if (!auth) {
    throw new Error(
      'Firebase web configuration is incomplete. Add the Firebase web app values to app/.env.',
    )
  }
  return auth
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, setProfileRevision] = useState(0)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    return onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      },
      () => {
        setUser(null)
        setLoading(false)
        setError('Unable to verify the current account. Please sign in again.')
      },
    )
  }, [])

  async function signIn(email: string, password: string) {
    setError(null)
    try {
      await signInWithEmailAndPassword(requireAuth(), email.trim(), password)
    } catch (cause) {
      setError(firebaseErrorMessage(cause, 'Unable to sign in. Please try again.'))
      throw cause
    }
  }

  async function signUp(email: string, password: string, displayName?: string) {
    setError(null)
    try {
      const credential = await createUserWithEmailAndPassword(
        requireAuth(),
        email.trim(),
        password,
      )
      const normalizedName = displayName?.trim().replace(/\s+/g, ' ')
      if (!normalizedName) throw new Error('Enter your name to create your account.')
      await updateProfile(credential.user, { displayName: normalizedName })
      setProfileRevision((revision) => revision + 1)
    } catch (cause) {
      setError(firebaseErrorMessage(cause, 'Unable to create the account. Please try again.'))
      throw cause
    }
  }

  async function updateDisplayName(name: string) {
    const normalizedName = name.trim().replace(/\s+/g, ' ')
    if (!normalizedName) throw new Error('Name cannot be empty.')
    const currentUser = requireAuth().currentUser
    if (!currentUser) throw new Error('Sign in again to update your profile.')
    setError(null)
    try {
      await updateProfile(currentUser, { displayName: normalizedName })
      setProfileRevision((revision) => revision + 1)
    } catch (cause) {
      setError(firebaseErrorMessage(cause, 'Unable to update your profile name.'))
      throw cause
    }
  }

  async function signOut() {
    setError(null)
    try {
      await firebaseSignOut(requireAuth())
    } catch (cause) {
      setError(firebaseErrorMessage(cause, 'Unable to sign out. Please try again.'))
      throw cause
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, clearError: () => setError(null), signIn, signUp, signOut, updateDisplayName }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
