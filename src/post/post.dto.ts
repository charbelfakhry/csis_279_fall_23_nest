export type CreatePostRequestDTO = {
  content: string;
};

export type CreatePostResponseDTO = {
  content: string;
  picture?: string;
  post_id: string;
};
