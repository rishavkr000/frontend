import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ArrowUp, ArrowDown, MessageCircle,
  Check, Star, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import RichTextEditor from '@/components/RichTextEditor';
import API from '@/lib/axios';

interface Answer {
  _id: string;
  body: string;
  author: { name: string };
  votes: number;
  createdAt: string;
  isAccepted?: boolean;
}

interface Question {
  _id: string;
  title: string;
  body: string;
  author: { name: string };
  tags: string[];
  votes: number;
  answers: number;
  createdAt: string;
  views: number;
}

interface Props {
  questionId: string;
  onBack: () => void;
  user: { name: string; _id: string } | null;
}

const QuestionDetailPage = ({ questionId, onBack, user }: Props) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswerBody, setNewAnswerBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [questionVotes, setQuestionVotes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/questions/${questionId}`);
        setQuestion(res.data.question);
        setAnswers(res.data.answers);
        setQuestionVotes(res.data.question.votes);
      } catch (err) {
        console.error("Failed to load question:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [questionId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleQuestionVote = async (direction: 'up' | 'down') => {
    try {
      await API.post(`/questions/${questionId}/vote`, { direction }, { headers: getAuthHeaders() });
      setQuestionVotes(prev => prev + (direction === 'up' ? 1 : -1));
    } catch (err) {
      console.error('Voting error:', err);
    }
  };

  const handleAnswerVote = async (answerId: string, direction: 'up' | 'down') => {
    try {
      await API.patch(`/answers/${answerId}/vote`, { direction }, { headers: getAuthHeaders() });
      setAnswers(prev =>
        prev.map(a =>
          a._id === answerId ? { ...a, votes: a.votes + (direction === 'up' ? 1 : -1) } : a
        )
      );
    } catch (err) {
      console.error('Answer vote error:', err);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await API.patch(`/answers/${answerId}/accept`, {}, { headers: getAuthHeaders() });
      setAnswers(prev =>
        prev.map(a => ({
          ...a,
          isAccepted: a._id === answerId
        }))
      );
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerBody.trim() || !user) return;

    try {
      const res = await API.post(`/answers`, {
        questionId,
        body: newAnswerBody,
      }, { headers: getAuthHeaders() });

      setAnswers(prev => [...prev, res.data]);
      setNewAnswerBody('');
    } catch (err) {
      console.error('Answer submit error:', err);
    }
  };

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) return <p className="text-center py-12">Loading question...</p>;
  if (!question) return <p className="text-center py-12">Question not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Voting & Stats */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 space-y-4">
              <div className="flex flex-col items-center space-y-2 bg-white rounded-lg p-4 shadow-sm">
                <Button variant="ghost" size="sm" onClick={() => handleQuestionVote('up')}>
                  <ArrowUp />
                </Button>
                <span className={`font-bold text-lg ${questionVotes > 0 ? 'text-green-600' : questionVotes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {questionVotes}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleQuestionVote('down')}>
                  <ArrowDown />
                </Button>
                {/* <Separator className="w-full my-2" /> */}
                {/* <Button variant="ghost" size="sm"><Star /></Button>
                <Button variant="ghost" size="sm"><Share2 /></Button> */}
              </div>
              {/* <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold">{question.views}</div>
                <div className="text-sm text-gray-600">views</div>
              </div> */}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Question */}
            <Card className="shadow-lg bg-white/70 backdrop-blur-sm mb-8">
              <CardHeader>
                <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {question.tags.map(tag => (
                    <Badge key={tag} className="bg-blue-50 text-blue-700">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: question.body }} />
                <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
                  <div>
                    Asked {timeAgo(question.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    by <span className="font-medium text-blue-600">{question.author.name}</span>
                    <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs">
                      {question.author.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers */}
            <h2 className="text-xl font-bold mb-4">{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h2>
            {answers.map(ans => (
              <Card key={ans._id} className={`bg-white/70 backdrop-blur-sm shadow-lg mb-4 ${ans.isAccepted ? 'ring-2 ring-green-500' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                      <Button variant="ghost" size="sm" onClick={() => handleAnswerVote(ans._id, 'up')}><ArrowUp /></Button>
                      <span className={`font-bold ${ans.votes > 0 ? 'text-green-600' : ans.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>{ans.votes}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleAnswerVote(ans._id, 'down')}><ArrowDown /></Button>
                      {user?.name === question.author.name && (
                        <Button variant="ghost" size="sm" onClick={() => handleAcceptAnswer(ans._id)}>
                          <Check className={ans.isAccepted ? 'fill-current text-green-600' : ''} />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      {ans.isAccepted && (
                        <div className="text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm mb-2 w-fit">
                          <Check className="inline h-4 w-4 mr-1" /> Accepted Answer
                        </div>
                      )}
                      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: ans.body }} />
                      <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>Add comment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>answered {timeAgo(ans.createdAt)} by</span>
                          <span className="font-medium text-blue-600">{ans.author.name}</span>
                          <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs flex items-center justify-center">
                            {ans.author.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Answer */}
            {user ? (
              <Card className="mt-8 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Your Answer</h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitAnswer} className="space-y-4">
                    <RichTextEditor
                      value={newAnswerBody}
                      onChange={setNewAnswerBody}
                      placeholder="Write your answer here..."
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={!newAnswerBody.trim()}
                    >
                      Post Your Answer
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-8 bg-white/70 shadow-lg backdrop-blur-sm">
                <CardContent className="text-center py-8">
                  <p className="text-gray-600 mb-4">You must be logged in to post an answer.</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Sign In to Answer
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
