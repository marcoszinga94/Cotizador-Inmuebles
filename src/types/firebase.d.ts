declare module "firebase/app" {
  import { FirebaseApp, initializeApp } from "@firebase/app";
  export { FirebaseApp, initializeApp };
  export class FirebaseError extends Error {
    code: string;
    message: string;
  }
  export default { initializeApp, FirebaseError };
}

declare module "firebase/auth" {
  import {
    Auth,
    getAuth,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    User,
  } from "@firebase/auth";

  export { Auth, getAuth, signInWithPopup, GoogleAuthProvider, signOut, User };
  export type ErrorFn = (error: any) => void;
  export const AuthErrorCodes: {
    POPUP_BLOCKED: string;
    [key: string]: string;
  };
  export default {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    AuthErrorCodes,
  };
}
