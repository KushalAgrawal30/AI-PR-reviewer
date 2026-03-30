export type CurrentUser = {
  id: number;
  githubLogin: string;
  name: string;
  avatarUrl: string;
};

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
      {
        credentials: "include",
      }
    );

    // Treat both 401 and 403 as "not authenticated"
    if (response.status === 401 || response.status === 403) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    return response.json();
  } catch (error) {
    // Network error or parsing error - treat as not authenticated
    return null;
  }
}