export type SignUpUserInfo = {
  username: string;
  email: string;
  password: string;
  full_name: string;
  bio: string;
  profile_picture_url: string;
  created_at: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type UserToFrontEnd = {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  bio: string;
  profile_picture_url: string;
  created_at: string;
};
