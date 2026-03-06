import { prisma } from "../../lib/prisma";
import { RegisterDTO } from "../../types/auth";

// Registration
export async function findUserByUsername(username: string) {
  return await prisma.users.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
      bio: true,
    },
  });
}

export async function findEmail(email: string) {
  return await prisma.users.findUnique({
    where: { email },
  });
}

export async function adduser({
  username,
  fullname,
  email,
  password,
}: RegisterDTO) {
  return await prisma.users.create({
    data: {
      username,
      full_name: fullname,
      email,
      password,
    },
    select: {
      username: true,
      full_name: true,
      email: true,
    },
  });
}

export async function findUserById(id: number) {
  return await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
      bio: true,
    },
  });
}
