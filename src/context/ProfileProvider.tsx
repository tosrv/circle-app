import type { Dispatch, SetStateAction } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ProfileContextType {
  profile: string | null;
  setProfile: (username: string | null) => void;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user: loginUser } = useAuth();
  const [profile, setProfile] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(loginUser);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!loginUser) return;

    setUser((prev) => {
      if (!prev) return loginUser;
      return {
        ...prev,
        ...loginUser,
      };
    });
  }, [loginUser]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        user,
        setUser,
        editDialogOpen,
        setEditDialogOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile must be used within ProfileProvider");
  return context;
}
