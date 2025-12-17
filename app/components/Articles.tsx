"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Tilt } from "react-tilt";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "./HigherOrderComponents";

type Article = {
  id: string;
  title: string;
  brief: string;
  slug: string;
  url: string;
  publishedAt: string | null;
  coverImageUrl: string | null;
};

type ArticleCardProps = {
  index: number;
  article: Article;
};

const ArticleCard = ({ index, article }: ArticleCardProps) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[200px]">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              width={1000}
              height={600}
              className="w-full h-full object-cover rounded-2xl brightness-[.92] contrast-[1.03] saturate-[1.02]"
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm2 3v8h8V6H6z" />
              </svg>
            </div>
          )}

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[20px] leading-snug line-clamp-2">{article.title}</h3>
          <p className="mt-2 text-secondary text-[14px] line-clamp-3">{article.brief}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {article.publishedAt && (
            <span className="text-xs text-white/60">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          )}
          <Link
            href={article.url}
            target="_blank"
            className="black-gradient px-4 py-2 rounded-full text-sm font-semibold"
          >
            Read Article
          </Link>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/articles?ts=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setArticles(data);
        }
      } catch (e) {
        console.error("Failed to load articles", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        <div className="bg-tertiary/50 h-[320px] rounded-2xl animate-pulse" />
        <div className="bg-tertiary/50 h-[320px] rounded-2xl animate-pulse" />
        <div className="bg-tertiary/50 h-[320px] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!articles.length) return null; // Hide section if no pinned posts

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className="sectionSubText">Writing</p>
        <h2 className="sectionHeadText">Articles.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
            Sharing my thoughts and knowledge through articles on Hashnode.
        </motion.p>
      </div>

      <div className="mt-14 sm:mt-20 flex flex-wrap gap-7 justify-center">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} index={index} article={article} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Articles, "articles");
