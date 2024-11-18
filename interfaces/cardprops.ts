export interface CardProps {
  postId: number;
  name: string;
  category: string;
  title: string;
  description: string;
  comments: Comment[];
  avatar: string;
  timestamp: string;
  refetchAllPost: () => void;
}
