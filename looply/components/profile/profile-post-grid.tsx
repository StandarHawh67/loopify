import Image from "next/image";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCount } from "@/lib/utils";
import type { ProfilePost } from "@/types";

export function ProfilePostGrid({ posts }: { posts: ProfilePost[] }) {
  if (!posts.length) {
    return (
      <EmptyState
        title="Todavía no hay publicaciones"
        description="Cuando este perfil publique algo, aparecerá aquí en forma de grid visual."
      />
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="panel overflow-hidden p-0">
          <div className="relative aspect-[4/3] bg-[#0b1325]">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.content || "Post image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-end bg-gradient-to-br from-[#111a33] via-[#0e1730] to-[#1f365f] p-5">
                <p className="line-clamp-4 text-base leading-7 text-white/90">
                  {post.content || "Post visual sin texto"}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3 p-5">
            <p className="line-clamp-3 text-sm leading-6 text-mist">
              {post.content || "Publicación visual sin descripción."}
            </p>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-mist">
              <span>{formatCount(post.counts.likes)} likes</span>
              <span>{formatCount(post.counts.comments)} comments</span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
