"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArticleCard } from "@/components/article-card";
import { useAppState } from "@/hooks/use-app-state";
import { AILoader } from "./loader/ReelLoader";

interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  url: string;
  topic: string;
}

export function InfiniteReel() {
  const { selectedInterests: interests } = useAppState();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedArticles, setViewedArticles] = useState<Article[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const maxRetries = 3;
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();
  const isScrolling = useRef(false);

  const lastArticleElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Number.parseInt(
                entry.target.getAttribute("data-index") || "0",
              );
              setCurrentIndex(index);

              // Track viewed articles for quiz
              if (
                articles[index] &&
                !viewedArticles.find((a) => a.id === articles[index].id)
              ) {
                setViewedArticles((prev) => [...prev, articles[index]]);
              }

              // Show quiz after every 5 articles
              if (viewedArticles.length >= 1 && !showQuiz) {
                generateQuiz();
              }

              // Load more articles when approaching the end
              if (index >= articles.length - 2 && hasMore && !loading) {
                loadMoreArticles();
              }
            }
          });
        },
        // [loading, hasMore, viewedArticles],
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, viewedArticles, showQuiz],
  );

  const generateQuiz = async () => {
    if (viewedArticles.length < 5) return;

    try {
      const recentArticles = viewedArticles.slice(-5);
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articles: recentArticles }),
      });

      if (response.ok) {
        const quiz = await response.json();
        setQuizData(quiz);
        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const loadMoreArticles = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/wikipedia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests, count: 5 }),
      });

      if (response.ok) {
        const newArticles = await response.json();
        if (newArticles && newArticles.length > 0) {
          setArticles((prev) => [...prev, ...newArticles]);
          setRetryCount(0);
        } else {
          console.warn("No articles returned from API");
          if (retryCount < maxRetries) {
            setRetryCount((prev) => prev + 1);
            setTimeout(() => loadMoreArticles(), 2000);
          } else {
            setHasMore(false);
          }
        }
      } else {
        console.error(
          "API response not ok:",
          response.status,
          response.statusText,
        );
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => loadMoreArticles(), 2000);
        }
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => loadMoreArticles(), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrolling.current || showQuiz) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const windowHeight = window.innerHeight - 73;
        const targetIndex = Math.round(scrollTop / windowHeight);

        if (targetIndex !== currentIndex) {
          isScrolling.current = true;
          container.scrollTo({
            top: targetIndex * windowHeight,
            behavior: "smooth",
          });

          setTimeout(() => {
            isScrolling.current = false;
          }, 500);
        }
      }, 100);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, showQuiz]);

  useEffect(() => {
    loadMoreArticles();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-73px)] md:h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {articles.map((article, index) => (
        <div
          key={`${article.id}-${index}`}
          data-index={index}
          ref={index === articles.length - 1 ? lastArticleElementRef : null}
          className="h-full snap-start snap-always flex-shrink-0"
        >
          <ArticleCard article={article} />
        </div>
      ))}

      {loading && <AILoader totalArticles={10} loadingTime={3} />}
    </div>
  );
}
