import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfilePostGrid } from "@/components/profile/profile-post-grid";
import { requireCurrentUser } from "@/lib/auth";
import { getProfileByUsername } from "@/lib/queries";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function UserProfilePage({ params }: PageProps) {
  const currentUser = await requireCurrentUser();
  const { username } = await params;
  const profile = await getProfileByUsername({
    username: decodeURIComponent(username).toLowerCase(),
    viewerId: currentUser.id
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <ProfileHeader profile={profile} isOwnProfile={profile.id === currentUser.id} />
      <ProfilePostGrid posts={profile.posts} />
    </div>
  );
}
