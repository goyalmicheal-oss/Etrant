"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { McqCard } from "./question-card";
import { QuestionData } from "@/types";
import { AILoader } from "./loader/ReelLoader";

interface InfiniteReelProps {
  interests: string;
  language: string;
}

export function QuestionReel({ interests, language }: InfiniteReelProps) {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedQuestions, setViewedQuestions] = useState<QuestionData[]>([]);
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
                questions[index] &&
                !viewedQuestions.find(
                  (a) => a.question === questions[index].question,
                )
              ) {
                setViewedQuestions((prev) => [...prev, questions[index]]);
              }

              // Load more articles when approaching the end
              if (index >= questions.length - 2 && hasMore && !loading) {
                loadMoreArticles();
              }
            }
          });
        },
        [loading, hasMore, viewedQuestions],
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, viewedQuestions],
  );

  const loadMoreArticles = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests, language }),
      });

      if (response.ok) {
        const newArticles = await response.json();

        if (newArticles && newArticles.data.length > 0) {
          setQuestions((prev) => [...prev, ...newArticles.data]);
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

  // Handle scroll events to ensure snap behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrolling.current) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const windowHeight = window.innerHeight - 73; // Account for header
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
  }, [currentIndex]);

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
      {questions.map((question, index) => (
        <div
          key={`${question.question}-${index}`}
          data-index={index}
          ref={index === questions.length - 1 ? lastArticleElementRef : null}
          className="h-full snap-start snap-always flex-shrink-0"
        >
          <McqCard currentQuestion={question} />
        </div>
      ))}

      {loading && <AILoader totalArticles={10} loadingTime={10} />}
    </div>
  );
}
