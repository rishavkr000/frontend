
import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, MessageCircle, Check, Star, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import RichTextEditor from '@/components/RichTextEditor';

interface Answer {
  id: string;
  body: string;
  author: string;
  votes: number;
  timestamp: string;
  isAccepted?: boolean;
}

interface QuestionDetailPageProps {
  questionId: string;
  onBack: () => void;
  user: { name: string } | null;
}

// Mock question data
const mockQuestion = {
  id: '1',
  title: 'How to optimize React performance with large datasets?',
  body: `<p>I have a React application that renders thousands of items in a list. The performance is getting sluggish when scrolling and interacting with the list.</p>
  
  <p><strong>What I've tried:</strong></p>
  <ul>
    <li>Using React.memo() for list items</li>
    <li>Implementing useMemo for expensive calculations</li>
    <li>Adding keys to list items</li>
  </ul>
  
  <p><strong>Current implementation:</strong></p>
  <pre><code>const ItemList = ({ items }) => {
    return (
      &lt;div&gt;
        {items.map(item => (
          &lt;ListItem key={item.id} item={item} /&gt;
        ))}
      &lt;/div&gt;
    );
  };</code></pre>
  
  <p>What are the best practices for optimizing React performance when dealing with large datasets? Should I be looking into virtualization or other techniques?</p>`,
  author: 'JohnDoe',
  tags: ['React', 'Performance', 'JavaScript'],
  votes: 15,
  answers: 3,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  views: 1247,
};

const mockAnswers: Answer[] = [
  {
    id: '1',
    body: `<p>For large datasets in React, I recommend using <strong>virtualization</strong>. Here are the key strategies:</p>
    
    <h3>1. React Window or React Virtualized</h3>
    <p>These libraries only render the visible items:</p>
    <pre><code>import { FixedSizeList as List } from 'react-window';

const ItemList = ({ items }) => (
  &lt;List
    height={600}
    itemCount={items.length}
    itemSize={35}
  &gt;
    {Row}
  &lt;/List&gt;
);</code></pre>

    <h3>2. Optimize Re-renders</h3>
    <ul>
    <li>Use React.memo() with proper comparison</li>
    <li>Implement useCallback for event handlers</li>
    <li>Consider useMemo for expensive computations</li>
    </ul>

    <p>This approach can handle 10,000+ items smoothly.</p>`,
    author: 'ReactExpert',
    votes: 12,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isAccepted: true,
  },
  {
    id: '2',
    body: `<p>Another approach is to implement <strong>pagination or infinite scrolling</strong>:</p>
    
    <pre><code>const useInfiniteScroll = (fetchMore) => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        fetchMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMore]);
};</code></pre>
    
    <p>This way you only load data as needed, which is great for user experience and performance.</p>`,
    author: 'DevGuru',
    votes: 8,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

const QuestionDetailPage = ({ questionId, onBack, user }: QuestionDetailPageProps) => {
  const [question] = useState(mockQuestion);
  const [answers, setAnswers] = useState(mockAnswers);
  const [newAnswerBody, setNewAnswerBody] = useState('');
  const [questionVotes, setQuestionVotes] = useState(question.votes);

  const handleQuestionVote = (direction: 'up' | 'down') => {
    setQuestionVotes(prev => prev + (direction === 'up' ? 1 : -1));
  };

  const handleAnswerVote = (answerId: string, direction: 'up' | 'down') => {
    setAnswers(prev => prev.map(answer => 
      answer.id === answerId 
        ? { ...answer, votes: answer.votes + (direction === 'up' ? 1 : -1) }
        : answer
    ));
  };

  const handleAcceptAnswer = (answerId: string) => {
    setAnswers(prev => prev.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId ? !answer.isAccepted : false
    })));
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnswerBody && user) {
      const newAnswer: Answer = {
        id: Date.now().toString(),
        body: newAnswerBody,
        author: user.name,
        votes: 0,
        timestamp: new Date().toISOString(),
      };
      setAnswers(prev => [...prev, newAnswer]);
      setNewAnswerBody('');
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Voting Column */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 space-y-4">
              <div className="flex flex-col items-center space-y-2 bg-white rounded-lg p-4 shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuestionVote('up')}
                  className="h-10 w-10 p-0 hover:bg-green-50 hover:text-green-600"
                >
                  <ArrowUp className="h-6 w-6" />
                </Button>
                <span className={`font-bold text-lg ${questionVotes > 0 ? 'text-green-600' : questionVotes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {questionVotes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuestionVote('down')}
                  className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <ArrowDown className="h-6 w-6" />
                </Button>
                <Separator className="w-full my-2" />
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-yellow-50 hover:text-yellow-600">
                  <Star className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-blue-50 hover:text-blue-600">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{question.views}</div>
                <div className="text-sm text-gray-600">views</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Question */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm mb-8">
              <CardHeader>
                <div className="flex flex-col space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {question.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: question.body }}
                />
                
                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span>Asked {timeAgo(question.timestamp)}</span>
                    <span>Modified {timeAgo(question.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>by</span>
                    <span className="font-medium text-blue-600">{question.author}</span>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                      {question.author.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                {answers.length} Answer{answers.length !== 1 ? 's' : ''}
              </h2>

              {answers.map((answer) => (
                <Card key={answer.id} className={`shadow-lg border-0 bg-white/70 backdrop-blur-sm ${answer.isAccepted ? 'ring-2 ring-green-500' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* Answer Voting */}
                      <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAnswerVote(answer.id, 'up')}
                          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                        >
                          <ArrowUp className="h-5 w-5" />
                        </Button>
                        <span className={`font-bold ${answer.votes > 0 ? 'text-green-600' : answer.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {answer.votes}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAnswerVote(answer.id, 'down')}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <ArrowDown className="h-5 w-5" />
                        </Button>
                        {user && user.name === question.author && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAcceptAnswer(answer.id)}
                            className={`h-8 w-8 p-0 ${answer.isAccepted ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'hover:bg-green-50 hover:text-green-600'}`}
                          >
                            <Check className={`h-5 w-5 ${answer.isAccepted ? 'fill-current' : ''}`} />
                          </Button>
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1">
                        {answer.isAccepted && (
                          <div className="flex items-center mb-3 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium w-fit">
                            <Check className="h-4 w-4 mr-1" />
                            Accepted Answer
                          </div>
                        )}
                        
                        <div 
                          className="prose prose-sm max-w-none mb-4"
                          dangerouslySetInnerHTML={{ __html: answer.body }}
                        />
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>Add comment</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>answered {timeAgo(answer.timestamp)} by</span>
                            <span className="font-medium text-blue-600">{answer.author}</span>
                            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                              {answer.author.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Answer */}
            {user ? (
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm mt-8">
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
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm mt-8">
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
