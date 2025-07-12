export interface Question {
  _id: string;
  title: string;
  body: string;
  author: {
    name: string;
    _id: string;
  };
  tags: string[];
  votes: number;
  createdAt: string;
  answers?: number;
  hasAcceptedAnswer?: boolean;
}
