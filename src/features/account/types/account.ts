export type AccountProfile = {
  id: string;
  nickname: string | null;
  membershipLevel: string;
  remainingCredits: number;
  membershipExpiresAt: string | null;
  profileUpdatedAt: string | null;
  emailRebindRequestedAt: string | null;
  createdAt: string;
};

export type AccountUser = {
  id: string;
  email: string | null;
  emailConfirmedAt: string | null;
  createdAt: string;
};

export type AccountActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };
