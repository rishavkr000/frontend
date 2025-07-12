import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/QuestionCard';
import Sidebar from '@/components/Sidebar';
import API from '@/lib/axios';

interface Question {
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

interface HomePageProps {
  onAskQuestion: () => void;
  onQuestionClick: (id: string) => void;
  questions: Question[];
  filteredQuestions: Question[];
  setFilteredQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const HomePage = ({
  onAskQuestion,
  onQuestionClick,
  questions,
  filteredQuestions,
  setFilteredQuestions,
}: HomePageProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(q =>
        q.tags.some(tag => selectedTags.includes(tag))
      );
      setFilteredQuestions(filtered);
    }
  }, [questions, selectedTags, setFilteredQuestions]);

  const handleTagSelect = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleVote = async (id: string, direction: 'up' | 'down') => {
    try {
      await API.post(`/questions/${id}/vote`, { direction }, {
        headers: getAuthHeaders(),
      });

      // ✅ Only update state if API is successful
      const updated = filteredQuestions.map(q =>
        q._id === id
          ? { ...q, votes: q.votes + (direction === 'up' ? 1 : -1) }
          : q
      );
      setFilteredQuestions(updated);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Questions</h1>
                <p className="text-gray-600">
                  {selectedTags.length > 0
                    ? `Filtered by: ${selectedTags.join(', ')}`
                    : `${filteredQuestions.length} questions waiting for answers`}
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

            {/* Question Cards */}
            <div className="space-y-6">
              {filteredQuestions.map((q) => (
                <QuestionCard
                  key={q._id}
                  question={{
                    ...q,
                    id: q._id,
                    timestamp: q.createdAt,
                    author: q.author,
                    answers: q.answers || 0,
                  }}
                  onClick={onQuestionClick}
                  onVote={handleVote}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedTags.length > 0
                    ? 'Try adjusting your tag filters or ask the first question for these tags!'
                    : 'Be the first one to ask a question!'}
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
