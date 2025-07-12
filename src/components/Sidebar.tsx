import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Tag, Filter } from 'lucide-react';
import API from '@/lib/axios';

interface SidebarProps {
  type: 'left' | 'right';
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

interface TagCount {
  name: string;
  count: number;
}

interface Question {
  _id: string;
  title: string;
  votes: number;
}

const Sidebar = ({ type, selectedTags, onTagSelect }: SidebarProps) => {
  const [topTags, setTopTags] = useState<TagCount[]>([]);
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchSidebarData = async () => {
    try {
      const res = await API.get('/questions');
      const allQuestions = res.data;

      // Extract all tags with count
      const tagCountMap: Record<string, number> = {};
      const questionList: Question[] = [];

      allQuestions.forEach((q: any) => {
        questionList.push({ _id: q._id, title: q.title, votes: q.votes });
        q.tags.forEach((tag: string) => {
          tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
        });
      });

      const suggestedTags = [
        'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python',
        'HTML', 'CSS', 'MongoDB', 'Express', 'API', 'Database',
        'Frontend', 'Backend', 'Performance', 'Security'
      ];

      const tagArray: TagCount[] = suggestedTags.map(tag => ({
        name: tag,
        count: tagCountMap[tag] || 0
      }));

      const trending = questionList
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 5);

      setTopTags(tagArray);
      setTrendingQuestions(trending);
    } catch (error) {
      console.error("Sidebar API error:", error);
    }
  };

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
            {topTags.map((tag) => (
              <Button
                key={tag.name}
                variant={selectedTags.includes(tag.name) ? "default" : "ghost"}
                className={`w-full justify-between hover:bg-green-50 ${selectedTags.includes(tag.name)
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
      {/* Trending Questions */}
      {/* <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Trending Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingQuestions.map((q) => (
            <div key={q._id} className="group cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-colors">
              <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 line-clamp-2 mb-1">
                {q.title}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {q.votes} votes
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card> */}

      {/* Popular Tags */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Tag className="h-5 w-5 mr-2 text-orange-600" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topTags.slice(0, 6).map((tag) => (
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
