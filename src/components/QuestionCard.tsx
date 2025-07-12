
import React from 'react';
import { ArrowUp, ArrowDown, MessageCircle, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Question {
  id: string;
  title: string;
  body: string;
  author: {
    _id: string;
    name: string;
  };
  tags: string[];
  votes: number;
  answers?: number;
  timestamp: string;
  hasAcceptedAnswer?: boolean;
}

interface QuestionCardProps {
  question: Question;
  onClick: (id: string) => void;
  onVote: (id: string, direction: 'up' | 'down') => void;
}

const QuestionCard = ({ question, onClick, onVote }: QuestionCardProps) => {
  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-purple-500 cursor-pointer group">
      <CardHeader className="pb-2">
        <div 
          className="flex flex-col space-y-2"
          onClick={() => onClick(question.id)}
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {question.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {question.body}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Votes */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(question.id, 'up');
                }}
                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className={`font-medium ${question.votes > 0 ? 'text-green-600' : question.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {question.votes}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(question.id, 'down');
                }}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Answers */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              question.hasAcceptedAnswer 
                ? 'bg-green-100 text-green-700' 
                : question.answers > 0 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
            }`}>
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{question.answers}</span>
            </div>
          </div>

          {/* Author and Time */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{timeAgo(question.timestamp)}</span>
            </div>
            <span>by</span>
            <span className="font-medium text-blue-600">{question.author.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
