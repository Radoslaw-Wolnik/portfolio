import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as blogApi from '../api/blog';
import { handleApiError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';
import BlogContent from '../components/BlogContent';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogApi.getBlogPostById(id as string);
        setPost(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-8">
        By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <BlogContent content={post.content} />
    </article>
  );
};

export default BlogPost;