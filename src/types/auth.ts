export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

export interface LoginFormValues {
  username: string;
}
