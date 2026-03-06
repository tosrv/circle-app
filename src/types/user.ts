export interface User {
  id: number;
  full_name: string;
  username: string;
  photo_profile: string;
  bio: string;

  followers_count: number;
  following_count: number;

  is_following: boolean;
  is_me?: boolean;
}

export interface UserRequest {
  username: string;
  fullname: string;
  bio: string;
  image?: File;
}
