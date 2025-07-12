
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from './HomePage';
import AskQuestionPage from './AskQuestionPage';
import QuestionDetailPage from './QuestionDetailPage';
import LoginModal from '@/components/LoginModal';
import { useToast } from '@/hooks/use-toast';

type Page = 'home' | 'ask' | 'question';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    toast({
      title: "Search performed",
      description: `Searching for: ${query}`,
    });
  };

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    console.log('Login attempt:', { email, password });
    setUser({ name: 'John Doe', email });
    setIsLoginModalOpen(false);
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Mock registration - in real app, this would call an API
    console.log('Registration attempt:', { name, email, password });
    setUser({ name, email });
    setIsLoginModalOpen(false);
    toast({
      title: "Account created!",
      description: "Welcome to StackIt community.",
    });
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

  const handleQuestionSubmit = (question: { title: string; body: string; tags: string[] }) => {
    console.log('New question submitted:', question);
    toast({
      title: "Question posted!",
      description: "Your question has been posted successfully.",
    });
    setCurrentPage('home');
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
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar 
        onSearch={handleSearch}
        onLoginClick={() => setIsLoginModalOpen(true)}
        user={user}
        notificationCount={3}
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
