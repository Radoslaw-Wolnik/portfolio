// src/components/BlogTagFilter.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BlogTagFilterProps {
  tags: string[];
}

const BlogTagFilter: React.FC<BlogTagFilterProps> = ({ tags }) => {
  const location = useLocation();
  const currentTag = new URLSearchParams(location.search).get('tag');

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Filter by Tag</h2>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/blog"
          className={`px-3 py-1 rounded ${
            !currentTag ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag}
            to={`/blog?tag=${encodeURIComponent(tag)}`}
            className={`px-3 py-1 rounded ${
              currentTag === tag ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogTagFilter;