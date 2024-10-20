// src/pages/BlogSearchResults.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import BlogPostCard from '../components/BlogPostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogSearchResults: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await api.get(`/blog/search?query=${encodeURIComponent(query)}`);
        setPosts(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Search Results for &quot;{query}&quot;</h1>
      {posts.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogSearchResults;