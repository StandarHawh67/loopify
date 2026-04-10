import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("looply123", 12);

  const nova = await prisma.user.create({
    data: {
      email: "nova@looply.dev",
      username: "nova",
      passwordHash,
      bio: "Construyo loops visuales entre diseño, música y producto."
    }
  });

  const atlas = await prisma.user.create({
    data: {
      email: "atlas@looply.dev",
      username: "atlas",
      passwordHash,
      bio: "Capturo ciudades, texturas nocturnas y pequeños momentos urbanos."
    }
  });

  const sol = await prisma.user.create({
    data: {
      email: "sol@looply.dev",
      username: "solstice",
      passwordHash,
      bio: "Narrativas cortas, moodboards y energía creativa en movimiento."
    }
  });

  const novaAuroraPost = await prisma.post.create({
    data: {
      authorId: nova.id,
      content:
        "Probando el mood visual de Looply: oscuro, ligero y con suficiente espacio para que una imagen respire.",
      imageUrl: "/demo/aurora-loop.svg"
    }
  });

  const atlasTextPost = await prisma.post.create({
    data: {
      authorId: atlas.id,
      content:
        "Las mejores redes no te empujan a gritar; te invitan a volver. Ese es el tipo de ritmo que quiero encontrar aquí."
    }
  });

  const solCityPost = await prisma.post.create({
    data: {
      authorId: sol.id,
      content:
        "Una cuadrícula urbana también puede sentirse humana si el layout sabe dónde dejar silencio.",
      imageUrl: "/demo/city-grid.svg"
    }
  });

  const novaShortPost = await prisma.post.create({
    data: {
      authorId: nova.id,
      content:
        "Si el feed fluye bien en móvil y en desktop, el producto deja de pedir esfuerzo y empieza a acompañarte."
    }
  });

  await prisma.follow.createMany({
    data: [
      {
        followerId: atlas.id,
        followingId: nova.id
      },
      {
        followerId: sol.id,
        followingId: nova.id
      },
      {
        followerId: nova.id,
        followingId: atlas.id
      }
    ]
  });

  await prisma.like.createMany({
    data: [
      {
        userId: atlas.id,
        postId: novaAuroraPost.id
      },
      {
        userId: sol.id,
        postId: novaAuroraPost.id
      },
      {
        userId: nova.id,
        postId: atlasTextPost.id
      },
      {
        userId: atlas.id,
        postId: solCityPost.id
      }
    ]
  });

  const commentOnNova = await prisma.comment.create({
    data: {
      authorId: sol.id,
      postId: novaAuroraPost.id,
      content: "La combinación de color y respiración visual aquí está muy fina."
    }
  });

  const commentOnAtlas = await prisma.comment.create({
    data: {
      authorId: nova.id,
      postId: atlasTextPost.id,
      content: "Ese punto sobre el ritmo del producto está muy bien llevado."
    }
  });

  await prisma.comment.create({
    data: {
      authorId: atlas.id,
      postId: solCityPost.id,
      content: "Ese grid tiene vibra de portada editorial."
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        type: "FOLLOW",
        userId: nova.id,
        actorId: atlas.id
      },
      {
        type: "FOLLOW",
        userId: nova.id,
        actorId: sol.id
      },
      {
        type: "LIKE",
        userId: nova.id,
        actorId: atlas.id,
        postId: novaAuroraPost.id
      },
      {
        type: "COMMENT",
        userId: nova.id,
        actorId: sol.id,
        postId: novaAuroraPost.id,
        commentId: commentOnNova.id
      },
      {
        type: "COMMENT",
        userId: atlas.id,
        actorId: nova.id,
        postId: atlasTextPost.id,
        commentId: commentOnAtlas.id
      }
    ]
  });

  console.log("Looply seed completado.");
  console.log("Usuarios demo:");
  console.log("nova@looply.dev / looply123");
  console.log("atlas@looply.dev / looply123");
  console.log("sol@looply.dev / looply123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
