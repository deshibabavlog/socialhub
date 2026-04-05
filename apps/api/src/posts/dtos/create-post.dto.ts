export class CreatePostDto {
  brandId: string;
  title?: string;
  content: string;
  platforms?: string[];
  scheduledAt?: string;
  mediaIds?: string[];
}
