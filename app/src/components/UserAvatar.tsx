import { useState } from "react";
import type { User } from "firebase/auth";

export function UserAvatar({ user, size = 30 }: { user: User; size?: number }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const displayName = user.displayName?.trim();
  const label = displayName || user.email || "Account";
  const words = (displayName || user.email?.split("@")[0] || "U").trim().split(/[\s._-]+/).filter(Boolean);
  const initials = (words.length > 1 ? `${words[0][0]}${words.at(-1)?.[0]}` : words[0].slice(0, 2)).toUpperCase();
  return (
    <span className="user-avatar" style={{ width: size, height: size }} title={label} aria-label={label}>
      {user.photoURL && !photoFailed ? <img src={user.photoURL} alt="" onError={() => setPhotoFailed(true)} /> : initials}
    </span>
  );
}
