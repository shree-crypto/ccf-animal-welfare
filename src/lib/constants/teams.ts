// Team IDs for role-based access control
// These should be created in Appwrite and the IDs updated here
export const TEAM_IDS = {
  VOLUNTEER: process.env.NEXT_PUBLIC_APPWRITE_VOLUNTEER_TEAM_ID || 'volunteer-team',
  ADMIN: process.env.NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID || 'admin-team',
} as const;

export const ROLE_HIERARCHY = {
  public: 0,
  volunteer: 1,
  admin: 2,
} as const;
