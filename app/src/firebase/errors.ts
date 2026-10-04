export function firebaseErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.startsWith('Firebase web configuration is incomplete')) {
    return error.message
  }

  const code =
    typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
      ? error.code
      : ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.'
    case 'auth/email-already-in-use':
      return 'An account already exists for this email address.'
    case 'auth/weak-password':
      return 'Choose a stronger password with at least 6 characters.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/network-request-failed':
    case 'unavailable':
      return 'Network unavailable. Check your connection and try again.'
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Access denied. Verify your account permissions and try again.'
    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is not enabled for this Firebase project.'
    default:
      return fallback
  }
}