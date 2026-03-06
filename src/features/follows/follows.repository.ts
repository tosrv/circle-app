import { prisma } from "../../lib/prisma";

// User to follow
export async function findFollows(userId: number) {
  const alreadyFollowing = await prisma.following.findMany({
    where: { follower_id: userId },
    select: { following_id: true },
  });

  return alreadyFollowing.map((f) => f.following_id);
}

export async function findUsersToFollow(followIds: number[], userId: number) {
  const users = await prisma.users.findMany({
    where: {
      id: {
        notIn: [userId, ...followIds],
      },
    },
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
    },
  });

  const shuffled = users.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 3);
}

export async function findFollowers(username: string, userId: number) {
  const users = await prisma.users.findUnique({
    where: { username },
    select: {
      followers: {
        select: {
          follower: {
            select: {
              id: true,
              username: true,
              full_name: true,
              photo_profile: true,
              followers: {
                where: {
                  follower_id: userId,
                },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  return (
    users?.followers.map((f) => ({
      ...f.follower,
      is_following: f.follower.followers.length > 0,
    })) ?? []
  );
}

export async function findFollowing(username: string, userId: number) {
  const users = await prisma.users.findUnique({
    where: { username },
    select: {
      followings: {
        select: {
          following: {
            select: {
              id: true,
              username: true,
              full_name: true,
              photo_profile: true,
              followers: {
                where: {
                  follower_id: userId,
                },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  return (
    users?.followings.map((f) => ({
      ...f.following,
      is_following: f.following.followers.length > 0,
    })) ?? []
  );
}

// Check user follows
export async function existFollow(id: number, followingId: number) {
  return await prisma.following.findUnique({
    where: {
      following_id_follower_id: {
        following_id: followingId,
        follower_id: id,
      },
    },
  });
}

// Delete user follows
export async function unfollowUser(id: number, followingId: number) {
  await prisma.following.delete({
    where: {
      following_id_follower_id: {
        following_id: followingId,
        follower_id: id,
      },
    },
  });
}

// Create user follows
export async function followUser(id: number, followingId: number) {
  await prisma.following.create({
    data: {
      following_id: followingId,
      follower_id: id,
    },
  });
}

export async function countFollowers(id: number) {
  return await prisma.following.count({
    where: {
      following_id: id,
    },
  });
}

export async function countFollowing(id: number) {
  return await prisma.following.count({
    where: {
      follower_id: id,
    },
  });
}
