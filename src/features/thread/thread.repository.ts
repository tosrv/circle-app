import { prisma } from "../../lib/prisma";

// Display all threads
export async function findThreads() {
  return await prisma.threads.findMany({
    take: 25,
    orderBy: {
      created_at: "desc",
    },
    include: {
      created: {
        select: {
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
      likes: {
        select: {
          user_id: true,
          thread_id: true,
        },
      },
      replies: {
        select: {
          id: true,
          content: true,
          thread_id: true,
          created_at: true,
          created: {
            select: {
              username: true,
              full_name: true,
              photo_profile: true,
            },
          },
        },
      },
    },
  });
}

// Create new thread
export async function addThread(
  userId: number,
  content: string,
  images: string[],
) {
  return await prisma.threads.create({
    data: {
      content,
      images,
      created_by: userId,
    },
    include: {
      created: {
        select: {
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
  });
}

// Find Thread
export async function findThread(id: number) {
  return await prisma.threads.findUnique({
    where: { id },
    select: {
      id: true,
      content: true,
      images: true,
      created_at: true,
      created_by: true,
      likes: {
        select: {
          user_id: true,
          thread_id: true,
        },
      },
      replies: {
        select: {
          id: true,
          content: true,
          thread_id: true,
          created_at: true,
        },
      },
      created: {
        select: {
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
  });
}

// Delete thread
export async function removeThread(id: number) {
  await prisma.threads.delete({
    where: { id },
  });
}

// // Update thread
export async function editThread(
  id: number,
  content: string,
  images: string[],
) {
  return await prisma.threads.update({
    where: { id },
    data: {
      content,
      images,
    },
    include: {
      created: {
        select: {
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
  });
}

// // Find threads by user
// export async function findThreadsByUser(userId: number) {
//   return await prisma.threads.findMany({
//     where: { created_by: userId },
//     include: {
//       created: {
//         select: {
//           username: true,
//           full_name: true,
//           photo_profile: true,
//         },
//       },
//       likes: {
//         select: {
//           user_id: true,
//           thread_id: true,
//         },
//       },
//       replies: {
//         select: {
//           id: true,
//           content: true,
//           thread_id: true,
//           created_at: true,
//           created: {
//             select: {
//               username: true,
//               full_name: true,
//               photo_profile: true,
//             },
//           },
//         },
//       },
//     },
//   });
// }
