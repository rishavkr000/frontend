
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/QuestionCard';
import Sidebar from '@/components/Sidebar';

// Mock data
const mockQuestions = [
  {
    id: '1',
    title: 'How to optimize React performance with large datasets?',
    body: 'I have a React application that renders thousands of items in a list. The performance is getting sluggish. What are the best practices for optimizing React performance when dealing with large datasets?',
    author: 'JohnDoe',
    tags: ['React', 'Performance', 'JavaScript'],
    votes: 15,
    answers: 3,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    hasAcceptedAnswer: true,
  },
  {
    id: '2',
    title: 'MongoDB aggregation pipeline best practices',
    body: 'I\'m working on complex aggregation queries in MongoDB and wondering about the best practices for performance optimization.',
    author: 'DataExpert',
    tags: ['MongoDB', 'Database', 'Performance'],
    votes: 8,
    answers: 2,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: '3',
    title: 'TypeScript vs JavaScript: When to use which?',
    body: 'I\'m starting a new project and can\'t decide between TypeScript and JavaScript. What are the pros and cons of each?',
    author: 'NewDev',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    votes: 12,
    answers: 5,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: '4',
    title: 'Node.js security vulnerabilities to watch out for',
    body: 'What are the most common security vulnerabilities in Node.js applications and how can I prevent them?',
    author: 'SecureDevOps',
    tags: ['Node.js', 'Security', 'Backend'],
    votes: 22,
    answers: 4,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    hasAcceptedAnswer: true,
  },
  {
    id: '5',
    title: 'CSS Grid vs Flexbox: Complete comparison',
    body: 'I\'m confused about when to use CSS Grid vs Flexbox. Can someone explain the differences and use cases?',
    author: 'CSSNinja',
    tags: ['CSS', 'Layout', 'Frontend'],
    votes: 18,
    answers: 6,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
];

interface HomePageProps {
  onAskQuestion: () => void;
  onQuestionClick: (id: string) => void;
}

const HomePage = ({ onAskQuestion, onQuestionClick }: HomePageProps) => {
  const [questions, setQuestions] = useState(mockQuestions);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);

  const handleTagSelect = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    
    if (newSelectedTags.length === 0) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(question =>
        question.tags.some(questionTag => newSelectedTags.includes(questionTag))
      );
      setFilteredQuestions(filtered);
    }
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    setQuestions(prev => prev.map(q => 
      q.id === id 
        ? { ...q, votes: q.votes + (direction === 'up' ? 1 : -1) }
        : q
    ));
    setFilteredQuestions(prev => prev.map(q => 
      q.id === id 
        ? { ...q, votes: q.votes + (direction === 'up' ? 1 : -1) }
        : q
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <Sidebar 
              type="left" 
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Questions</h1>
                <p className="text-gray-600">
                  {selectedTags.length > 0 
                    ? `Filtered by: ${selectedTags.join(', ')}` 
                    : `${filteredQuestions.length} questions waiting for answers`
                  }
                </p>
              </div>
              <Button 
                onClick={onAskQuestion}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={onQuestionClick}
                  onVote={handleVote}
                />
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedTags.length > 0 
                    ? 'Try adjusting your tag filters or ask the first question for these tags!'
                    : 'Be the first one to ask a question!'
                  }
                </p>
                <Button 
                  onClick={onAskQuestion}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ask the First Question
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block">
            <Sidebar 
              type="right" 
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
