import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Heart, MessageCircle, Share, Send, X } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Community() {
  const [, navigate] = useLocation();
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/community-posts'],
  });

  const createPostMutation = useMutation({
    mutationFn: (data: { content: string; imageData?: string }) => 
      apiRequest('POST', '/api/community-posts', data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your post has been shared with the community!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
      setNewPost("");
      handleRemoveImage();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const postData: { content: string; imageData?: string } = {
      content: newPost.trim()
    };

    if (selectedImage && imagePreview) {
      postData.imageData = imagePreview;
    }
    
    createPostMutation.mutate(postData);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="p-2"
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Community</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Post */}
        <Card className="mb-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Share Your Journey</h3>
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your latest ride, tips, or connect with fellow riders..."
              className="mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              rows={3}
              data-testid="textarea-new-post"
            />
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-w-sm h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  data-testid="button-remove-image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-add-photo"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </div>
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim() || createPostMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="button-share-post"
              >
                <Send className="h-4 w-4 mr-2" />
                {createPostMutation.isPending ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-300 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded" />
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <Card key={post.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200" data-testid={`text-post-author-${post.id}`}>
                          {post.user.firstName} {post.user.lastName}
                        </h4>
                        {post.tour && (
                          <span className="text-sm text-orange-500 font-medium">
                            • {post.tour.title}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-post-time-${post.id}`}>
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid={`text-post-content-${post.id}`}>
                    {post.content}
                  </p>
                  
                  {post.imageData && (
                    <div className="mb-4">
                      <img 
                        src={post.imageData} 
                        alt="Shared content" 
                        className="w-full max-h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        data-testid={`img-post-${post.id}`}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-red-500" data-testid={`button-like-${post.id}`}>
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-500" data-testid={`button-comment-${post.id}`}>
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-green-500" data-testid={`button-share-${post.id}`}>
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No Posts Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Be the first to share something with the community!</p>
                <Button 
                  onClick={() => setNewPost("Just completed an amazing ride! 🏍️")}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  data-testid="button-create-first-post"
                >
                  Share Your First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}