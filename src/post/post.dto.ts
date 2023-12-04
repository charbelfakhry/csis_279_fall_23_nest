import { Picture } from 'src/picture/picture.entity';

export type CreatePostRequestDTO = {
  content: string;
  picture?: Picture;
};

export type CreatePostResponseDTO = {
  content: string;
  picture?: string;
  post_id: string;
};
