"use client";

import React, { useState, useEffect } from 'react';

interface Article {
  title: string;
  summary: string;
  author: string;
  date: string;
}

interface ApiResponse {
  articles: Article[];
}

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json() as ApiResponse;
      console.log(data)
        // setArticles(data.articles);
    } catch (err) {
      setError('An error occurred while fetching articles');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

 
  void (async () => {
    try {
      await fetchArticles();
    } catch (err) {
      console.error('Error in fetchArticles:', err);
    }
  })();
}, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Latest News</h1>
      {/* {articles.map((article, index) => (
        <div key={index}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
          <p>By {article.author} on {new Date(article.date).toLocaleDateString()}</p>
        </div>
      ))} */}
    </div>
  );
};

export default NewsFeed;