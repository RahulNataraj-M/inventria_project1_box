
'use client';
import {
  Auth,
  UserCredential,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

type AuthErrorCallback = (error: any) => void;
type AuthSuccessCallback<T> = (result: T) => void;

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(
    authInstance: Auth,
    onSuccess?: AuthSuccessCallback<UserCredential>,
    onError?: AuthErrorCallback
): void {
  signInAnonymously(authInstance)
    .then(onSuccess)
    .catch(onError);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
    authInstance: Auth,
    email: string,
    password: string,
    onSuccess?: AuthSuccessCallback<UserCredential>,
    onError?: AuthErrorCallback
): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(onSuccess)
    .catch(onError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
    authInstance: Auth,
    email: string,
    password: string,
    onSuccess?: AuthSuccessCallback<UserCredential>,
    onError?: AuthErrorCallback
): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(onSuccess)
    .catch(onError);
}

/** Initiate Google Sign-In (non-blocking popup). */
export function initiateGoogleSignIn(
  authInstance: Auth,
  onSuccess?: AuthSuccessCallback<UserCredential>,
  onError?: AuthErrorCallback
): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authInstance, provider)
    .then(onSuccess)
    .catch(onError);
}
