import { Picture } from "src/picture/picture.entity";

export type CreatePostDTO = {
    content : string;
    picture?:Picture;

}

