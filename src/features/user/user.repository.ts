import { prisma } from "../../lib/prisma";

// Update user data
export async function editUser(
  id: number,
  username: string,
  fullname: string,
  bio: string,
  image?: string,
) {
  return await prisma.users.update({
    where: { id },
    data: {
      username,
      full_name: fullname,
      bio,
      photo_profile: image,
    },
    select: {
      username: true,
      full_name: true,
      photo_profile: true,
      bio: true,
    },
  });
}

// Find exist username for update
export async function findUsername(username: string, id: number) {
  return await prisma.users.findFirst({
    where: {
      username,
      NOT: {
        id: id,
      },
    },
  });
}

export async function findUserByUsernameOrName(search: string, id: number) {
  return await prisma.users.findMany({
    where: {
      OR: [
        { username: search },
        { full_name: { contains: search, mode: "insensitive" } },
      ],
    },
    take: 10,
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
      bio: true,
      followers: {
        where: {
          follower_id: id,
        },
        select: { id: true },
      },
    },
  });
}
