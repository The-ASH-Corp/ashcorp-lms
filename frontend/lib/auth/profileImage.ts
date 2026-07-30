import type { AuthUser } from "@/lib/redux/features/auth/authSlice";

const FALLBACK_PROFILE_IMAGE =
  "https://ashacademylms.com/assets/images/profile/demo-profile.png";

export const getUserProfileImageUrl = (
  profileImage?: string | null,
): string => {
  if (!profileImage) {
    return FALLBACK_PROFILE_IMAGE;
  }

  if (/^(https?:\/\/|data:image)/i.test(profileImage)) {
    return profileImage;
  }

  if (profileImage.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
    return baseUrl ? `${baseUrl}${profileImage}` : profileImage;
  }

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
  const normalizedPath = profileImage.replace(/^\/+/, "");

  return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
};

export const getUserProfileImageFromUser = (
  user?: Pick<AuthUser, "profileImage"> | null,
): string => {
  return getUserProfileImageUrl(user?.profileImage ?? null);
};
