"use client";

import Link from "next/link";
import { useState } from "react";
import { FollowButton } from "@/components/profile/follow-button";
import { Avatar } from "@/components/ui/avatar";
import { formatCount } from "@/lib/utils";
import type { ProfileData } from "@/types";

export function ProfileHeader({
  profile,
  isOwnProfile
}: {
  profile: ProfileData;
  isOwnProfile: boolean;
}) {
  const [currentProfile, setCurrentProfile] = useState(profile);

  return (
    <section className="panel p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <Avatar
            src={currentProfile.avatarUrl}
            alt={currentProfile.username}
            name={currentProfile.username}
            className="h-20 w-20 rounded-[1.75rem] text-xl"
          />
          <div className="space-y-3">
            <div>
              <p className="font-display text-3xl font-semibold">@{currentProfile.username}</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-mist">
                {currentProfile.bio || "Este perfil todavía no ha añadido una bio."}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-mist">
              <span>
                <strong className="text-white">{formatCount(currentProfile.counts.posts)}</strong> posts
              </span>
              <span>
                <strong className="text-white">
                  {formatCount(currentProfile.counts.followers)}
                </strong>{" "}
                followers
              </span>
              <span>
                <strong className="text-white">
                  {formatCount(currentProfile.counts.following)}
                </strong>{" "}
                following
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          {isOwnProfile ? (
            <Link
              href="/settings/profile"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
            >
              Editar perfil
            </Link>
          ) : (
            <FollowButton
              username={currentProfile.username}
              initialFollowing={currentProfile.isFollowing}
              onChange={(payload) =>
                setCurrentProfile((current) => ({
                  ...current,
                  isFollowing: payload.isFollowing,
                  counts: payload.counts
                }))
              }
            />
          )}
          <p className="text-xs uppercase tracking-[0.18em] text-mist">
            En Looply desde{" "}
            {new Intl.DateTimeFormat("es-ES", {
              month: "long",
              year: "numeric"
            }).format(new Date(currentProfile.createdAt))}
          </p>
        </div>
      </div>
    </section>
  );
}
