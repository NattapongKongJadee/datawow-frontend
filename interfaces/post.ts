export interface Post {
  id: number;
  title: string;
  name: string;
  category: string;
  description: string;
  commentsCount: number;
  comments: Comment[];
  avatar: string;
  timestamp: string;
}

export interface Comment {
  commentId: number;
  author: string;
  content: string;
  timestamp: string;
}
