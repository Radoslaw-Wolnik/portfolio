// src/pages/BlogPostList.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as blogApi from '../api/blog';
import { handleApiError } from '../utils/errorHandler';
import BlogPostCard from '../components/BlogPostCard';
import BlogSearch from '../components/BlogSearch';
import BlogTagFilter from '../components/BlogTagFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogPostList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTag = searchParams.get('tag');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogApi.getBlogPosts(1, 10, currentTag || undefined);
        setPosts(response.data.data);
        
        // Fetch all unique tags
        const tagsResponse = await blogApi.getBlogPosts(1, 1000); // Assuming this endpoint returns tags
        const allTags = tagsResponse.data.data.flatMap(post => post.tags);
        setTags(Array.from(new Set(allTags)));
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentTag]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Blog Posts</h1>
      <BlogSearch />
      <BlogTagFilter tags={tags} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;