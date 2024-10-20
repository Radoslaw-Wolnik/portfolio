// src/pages/BlogPostEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

const BlogPostEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<BlogContent[]>([]);

  useEffect(() => {
    if (id) {
      const fetchBlogPost = async () => {
        try {
          const response = await api.get(`/blog-posts/${id}`);
          const post: BlogPost = response.data;
          setTitle(post.title);
          setContent(post.content);
        } catch (error) {
          console.error('Error fetching blog post:', handleApiError(error));
        }
      };
      fetchBlogPost();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/blog-posts/${id}`, { title, content });
      } else {
        await api.post('/blog-posts', { title, content });
      }
      navigate('/blog');
    } catch (error) {
      console.error('Error saving blog post:', handleApiError(error));
    }
  };

  const addContentBlock = (type: 'text' | 'code' | 'image') => {
    setContent([...content, { type, content: '' }]);
  };

  const updateContentBlock = (index: number, newContent: string) => {
    const updatedContent = [...content];
    updatedContent[index].content = newContent;
    setContent(updatedContent);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            required
          />
        </div>

        {content.map((block, index) => (
          <div key={index} className="space-y-2">
            {block.type === 'text' && (
              <textarea
                value={block.content}
                onChange={(e) => updateContentBlock(index, e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                rows={4}
              />
            )}
            {block.type === 'code' && (
              <div>
                <textarea
                  value={block.content}
                  onChange={(e) => updateContentBlock(index, e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 font-mono"
                  rows={8}
                />
                <select
                  value={block.language}
                  onChange={(e) => {
                    const updatedContent = [...content];
                    updatedContent[index].language = e.target.value;
                    setContent(updatedContent);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="">Select language</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  {/* Add more language options as needed */}
                </select>
              </div>
            )}
            {block.type === 'image' && (
              <div>
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateContentBlock(index, e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                {block.content && (
                  <img src={block.content} alt="Preview" className="mt-2 max-w-full h-auto" />
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => addContentBlock('text')}
            className="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-600"
          >
            Add Text
          </button>
          <button
            type="button"
            onClick={() => addContentBlock('code')}
            className="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-600"
          >
            Add Code
          </button>
          <button
            type="button"
            onClick={() => addContentBlock('image')}
            className="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-600"
          >
            Add Image
          </button>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          {id ? 'Update' : 'Create'} Post
        </button>
      </form>
    </div>
  );
};

export default BlogPostEditor;