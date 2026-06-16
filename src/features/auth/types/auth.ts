export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type AuthActionResult =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message: string;
    };
