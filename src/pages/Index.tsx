
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from './HomePage';
import AskQuestionPage from './AskQuestionPage';
import QuestionDetailPage from './QuestionDetailPage';
import LoginModal from '@/components/LoginModal';
import { useToast } from '@/hooks/use-toast';
import API from '@/lib/axios';
import { Question } from '@/types/question';

type Page = 'home' | 'ask' | 'question';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (currentPage === 'home') {
      fetchQuestions();
    }
  }, [currentPage]);

  const fetchQuestions = async () => {
    try {
      const res = await API.get('/questions');
      setQuestions(res.data);
    } catch (error: any) {
      toast({
        title: 'Failed to fetch questions',
        description: error.response?.data?.error || 'Something went wrong',
      });
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    try {
      const res = await API.get(`/questions?search=${query}`);
      setFilteredQuestions(res.data);
      toast({
        title: "Search Success",
        description: `${res.data.length} result(s) found for "${query}"`,
      });
    } catch (err) {
      toast({
        title: "Search Failed",
        description: "Something went wrong while searching.",
      });
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await API.post('/auth/login', { email, password });

      const { token, user } = res.data;
      localStorage.setItem('token', token); // optional
      setUser(user);
      setIsLoginModalOpen(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      await API.post('/auth/register', { name, email, password, confirmPassword });
      toast({
        title: "Account created!",
        description: "You can now log in to your account.",
      });
      setIsLoginModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  const handleAskQuestion = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      toast({
        title: "Login required",
        description: "Please log in to ask a question.",
      });
      return;
    }
    setCurrentPage('ask');
  };

  const handleQuestionSubmit = async (question: { title: string; body: string; tags: string[] }) => {
    try {
      await API.post('/questions', question);
      toast({
        title: "Question posted!",
        description: "Your question has been posted successfully.",
      });
      setCurrentPage('home');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to post question",
      });
    }
  };

  const handleQuestionClick = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentPage('question');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'ask':
        return (
          <AskQuestionPage
            onBack={() => setCurrentPage('home')}
            onSubmit={handleQuestionSubmit}
          />
        );
      case 'question':
        return (
          <QuestionDetailPage
            questionId={selectedQuestionId}
            onBack={() => setCurrentPage('home')}
            user={user}
          />
        );
      default:
        return (
          <HomePage
            onAskQuestion={handleAskQuestion}
            onQuestionClick={handleQuestionClick}
            questions={questions}
            filteredQuestions={filteredQuestions}
            setFilteredQuestions={setFilteredQuestions}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar
        user={user}
        onSearch={handleSearch}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={() => {
          setUser(null);
        }}
        notificationCount={0}
      />

      {renderPage()}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Index;
