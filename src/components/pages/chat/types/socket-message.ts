export type SocketMessage = {
  id: string;
  content: string;
  createdAt: Date;
  replyToId?: string | null;
  replyTo?: {
    id: string;
    content: string;
    user: {
      id: string;
      name: string | null;
      avatar: string | null;
    };
  } | null;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
};