
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Tag, Filter } from 'lucide-react';

interface SidebarProps {
  type: 'left' | 'right';
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const leftSidebarTags = [
  { name: 'JavaScript', count: 1234 },
  { name: 'React', count: 987 },
  { name: 'TypeScript', count: 765 },
  { name: 'Node.js', count: 654 },
  { name: 'Python', count: 543 },
  { name: 'HTML', count: 432 },
  { name: 'CSS', count: 321 },
  { name: 'MongoDB', count: 210 },
];

const trendingQuestions = [
  { title: 'How to optimize React performance?', votes: 45 },
  { title: 'Best practices for Node.js security', votes: 32 },
  { title: 'TypeScript vs JavaScript in 2024', votes: 28 },
  { title: 'MongoDB aggregation pipeline tips', votes: 24 },
  { title: 'CSS Grid vs Flexbox comparison', votes: 19 },
];

const Sidebar = ({ type, selectedTags, onTagSelect }: SidebarProps) => {
  if (type === 'left') {
    return (
      <div className="w-64 space-y-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2 text-green-600" />
              Filter by Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leftSidebarTags.map((tag) => (
              <Button
                key={tag.name}
                variant={selectedTags.includes(tag.name) ? "default" : "ghost"}
                className={`w-full justify-between hover:bg-green-50 ${
                  selectedTags.includes(tag.name) 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : ''
                }`}
                onClick={() => onTagSelect(tag.name)}
              >
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  {tag.name}
                </div>
                <Badge variant="secondary" className="ml-2 bg-gray-100">
                  {tag.count}
                </Badge>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-64 space-y-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Trending Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingQuestions.map((question, index) => (
            <div key={index} className="group cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-colors">
              <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 line-clamp-2 mb-1">
                {question.title}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {question.votes} votes
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Tag className="h-5 w-5 mr-2 text-orange-600" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {leftSidebarTags.slice(0, 6).map((tag) => (
              <Badge 
                key={tag.name} 
                variant="secondary" 
                className="cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors"
                onClick={() => onTagSelect(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
