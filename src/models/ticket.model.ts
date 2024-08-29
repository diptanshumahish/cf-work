export interface Ticket {
  id: string;
  createdBy: string;
  assignedTo: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  comments: Comment[];
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

export interface Comment {
  content: string;
  author: string;
  createdAt: Date;
}
