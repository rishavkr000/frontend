
import React, { useState, FormEvent, KeyboardEvent } from 'react';
import { ArrowLeft, Tag, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from '@/components/RichTextEditor';

interface AskQuestionPageProps {
  onBack: () => void;
  onSubmit: (question: { title: string; body: string; tags: string[] }) => void;
}

const suggestedTags = [
  'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 
  'HTML', 'CSS', 'MongoDB', 'Express', 'API', 'Database', 
  'Frontend', 'Backend', 'Performance', 'Security'
];

const AskQuestionPage = ({ onBack, onSubmit }: AskQuestionPageProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() && body.trim() && tags.length > 0) {
      onSubmit({ title: title.trim(), body: body.trim(), tags });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Share your question with the community</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Question Title *
                    </Label>
                    <p className="text-sm text-gray-600">
                      Be specific and imagine you're asking a question to another person
                    </p>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. How do I optimize React performance with large datasets?"
                      className="text-base border-gray-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Body */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Question Details *
                    </Label>
                    <p className="text-sm text-gray-600">
                      Include all the information someone would need to answer your question
                    </p>
                    <RichTextEditor
                      value={body}
                      onChange={setBody}
                      placeholder="Describe your problem in detail. Include what you've tried, what you expected to happen, and what actually happened..."
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Tags * (Max 5)
                    </Label>
                    <p className="text-sm text-gray-600">
                      Add up to 5 tags to help others find and answer your question
                    </p>
                    
                    {/* Selected Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTag(tag)}
                              className="h-4 w-4 p-0 hover:bg-blue-300 ml-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Add New Tag */}
                    {tags.length < 5 && (
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Enter a tag..."
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(newTag);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddTag(newTag)}
                          disabled={!newTag || tags.includes(newTag)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Suggested Tags */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter(tag => !tags.includes(tag))
                          .slice(0, 8)
                          .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTag(tag)}
                              disabled={tags.length >= 5}
                              className="text-xs hover:bg-blue-50 hover:border-blue-300"
                            >
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={!title || !body || tags.length === 0}
                    >
                      Post Your Question
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Tips Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-blue-700">
                    💡 Writing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900">Title</h4>
                    <p className="text-gray-600">Be specific and summarize the problem</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Details</h4>
                    <p className="text-gray-600">Include what you tried and what went wrong</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Tags</h4>
                    <p className="text-gray-600">Add relevant technologies and topics</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-700">
                    ✅ Good Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <ul className="space-y-2">
                    <li>• Clear, specific title</li>
                    <li>• Complete problem description</li>
                    <li>• Code examples when relevant</li>
                    <li>• What you've already tried</li>
                    <li>• Relevant tags</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;
