// src/pages/BlogPost.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@utils/api';
import { handleApiError } from '@utils/errorHandler';
import { BlogPost as BlogPostType } from '@types/api';
import LoadingSpinner from '@components/LoadingSpinner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blog-posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching blog post:', handleApiError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!post) return <div>Post not found</div>;

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-8">
        By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
      </div>
      {post.content.map((block, index) => (
        <div key={index} className="mb-6">
          {block.type === 'text' && <p className="text-gray-800">{block.content}</p>}
          {block.type === 'code' && (
            <SyntaxHighlighter language={block.language || 'javascript'} style={vscDarkPlus}>
              {block.content}
            </SyntaxHighlighter>
          )}
          {block.type === 'image' && (
            <img src={block.content} alt="Blog post image" className="max-w-full h-auto rounded-lg shadow-md" />
          )}
        </div>
      ))}
      <div className="mt-8">
        <Link to={`/projects/${post.id}`} className="text-primary-600 hover:text-primary-800">
          View associated project
        </Link>
      </div>
    </article>
  );
};

export default BlogPost;