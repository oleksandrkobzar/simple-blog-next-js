import { ChangeEvent, MouseEventHandler, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { debounce } from "lodash"

import { Category, Post } from "../interfaces";
import { getCategoriesApi, getPostsApi } from "../shared/api";

import PostTile from "../components/PostTile";

interface BlogProps {
  posts: Array<Post>;
  pageCount: number;
  categories: Array<Category>;
  category: string;
  search: string;
}

const DEFAULT_LIMIT_POSTS = 6;

export async function getServerSideProps({query}: any) {
  const {page, limit, search, category} = query;

  const {posts, pageCount} = await getPostsApi(page, limit, search, category);
  const {categories} = await getCategoriesApi();

  return {props: {posts, pageCount, categories, category: category || "", search: search || ""}};
}

export default function Blog(props: BlogProps) {
  const [posts, setPosts] = useState(props.posts);
  const [search, setSearch] = useState(props.search || "");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(props.pageCount);
  const [category, setCategory] = useState(Number(props.category) || null)

  useEffect(() => {
    getPosts(page, DEFAULT_LIMIT_POSTS, search, category);
  }, [page, category]);

  useEffect(() => {
    getPosts(1, DEFAULT_LIMIT_POSTS, search, category);
    setPage(1)
  }, [search]);

  useEffect(() => {
    setPosts(props.posts);
  }, [props.posts]);

  const debouncedSearch = useRef(
    debounce((search) => {
      setSearch(search);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const getPosts = async (page = 1, limit = DEFAULT_LIMIT_POSTS, s = "", category = null) => {
    const {posts, pageCount} = await getPostsApi(page, limit, s, category);

    setPosts(posts);
    setPageCount(pageCount)
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }

  const handleSelectCategory = (idCategory: number | null = null) => {
    setCategory(idCategory)
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <Head>
        <title>Blog page</title>
        <meta name="description" content="Blog page"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <section className="px-8 my-8">
          <h2 className="mb-4 font-bold text-center text-3xl">From the blog</h2>
          <p className="text-base text-center max-w-md m-auto mb-8 text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsa libero
            labore natus atque, ducimus sed.
          </p>
          <div className="flex justify-between flex-col sm:flex-row gap-4 my-4">
            <input
              defaultValue={props.search}
              type="text"
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 text-gray-500"
              placeholder="Search"
            />
            <select name="categories" defaultValue={props.category} className="border border-gray-300 rounded-md px-4 py-2 text-gray-500"
                    onChange={(e) => handleSelectCategory(Number(e.target.value))}>
              <option value="">All</option>
              {
                props.categories && props.categories.map((category, key) =>
                  <option key={key} value={category.id}>{category.name}</option>
                )
              }
            </select>
          </div>
          {(posts && posts.length) ?
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post: Post, key) => (
                <PostTile key={key} post={post}/>
              ))}
            </div>
            : <div className="text-center">Posts not found</div>
          }
          {!!pageCount && <div className="flex justify-between mt-4">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 py-4 px-8 rounded-lg overflow-hidden text-white disabled:bg-indigo-300"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >prev
            </button>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 py-4 px-8 rounded-lg overflow-hidden text-white disabled:bg-indigo-300"
              onClick={() => setPage(page + 1)}
              disabled={page >= pageCount}
            >next
            </button>
          </div>}
        </section>
      </main>
    </div>
  );
}
