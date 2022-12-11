import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { debounce } from "lodash";

import { Category, Post } from "../interfaces";
import { getCategoriesApi, getPostsApi } from "../shared/api";
import { DEFAULT_LIMIT_POSTS } from "../shared/constants";

import PostTile from "../components/PostTile";

interface BlogProps {
  posts: Array<Post>;
  pageCount: number;
  categories: Array<Category>;
  category: string;
  search: string;
}

export async function getServerSideProps({ query }: any) {
  const { page, limit, search, category } = query;

  const { posts, pageCount } = await getPostsApi(page, limit, search, category);
  const { categories } = await getCategoriesApi();

  return { props: { posts, pageCount, categories, category: category || "", search: search || "" } };
}

export default function Blog(props: BlogProps) {
  const [posts, setPosts] = useState(props.posts);
  const [search, setSearch] = useState(props.search);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(props.pageCount);
  const [selectedCategory, setSelectedCategory] = useState(props.category);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (router.query.category) {
      setPosts(props.posts);
      setSelectedCategory(props.category);
      setSearch(router.query.search && String(router.query.search) || "");
    }
  }, [router.query.category]);

  const getPosts = async (page: number = 1, limit: number = DEFAULT_LIMIT_POSTS, search: string, category: string) => {
    setIsLoading(true);
    const { posts, pageCount } = await getPostsApi(page, limit, search, category);

    setPosts(posts);
    setPageCount(pageCount);
    setIsLoading(false);
  };

  const handleSelectCategory = async (idCategory: string) => {
    setSelectedCategory(idCategory);
    setPage(1);

    await getPosts(1, DEFAULT_LIMIT_POSTS, search, idCategory);
  };

  const handleSearch = async (_searchText: string, _selectedCategory: string) => {
    setSearch(_searchText);
    setPage(1);

    await getPosts(1, DEFAULT_LIMIT_POSTS, _searchText, _selectedCategory);
  };

  const handlePage = async (_page: number) => {
    setPage(_page);

    await getPosts(_page, DEFAULT_LIMIT_POSTS, search, selectedCategory);
  };

  const debouncedSearch = useRef(
    debounce(async (_search: string, _selectedCategory: string) => {
      await handleSearch(_search, _selectedCategory);
    }, 300)
  ).current;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value, selectedCategory);
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <Head>
        <title>Blog page</title>
        <meta name="description" content="Blog page" />
        <link rel="icon" href="/favicon.ico" />
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
              defaultValue={search}
              type="text"
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 text-gray-500"
              placeholder="Search"
            />
            <select
              name="categories"
              value={selectedCategory}
              className="border border-gray-300 rounded-md px-4 py-2 text-gray-500"
              onChange={(e) => handleSelectCategory(e.target.value)}
            >
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
                <PostTile key={key} post={post} />
              ))}
            </div>
            : <div className="text-center">Posts not found</div>
          }
          {(!!pageCount && pageCount > 1) && <div className="flex justify-between mt-4">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 py-4 px-8 rounded-lg overflow-hidden text-white disabled:bg-indigo-300"
              onClick={() => handlePage(page - 1)}
              disabled={page === 1 || isLoading}
            >prev
            </button>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 py-4 px-8 rounded-lg overflow-hidden text-white disabled:bg-indigo-300"
              onClick={() => handlePage(page + 1)}
              disabled={page >= pageCount || isLoading}
            >next
            </button>
          </div>}
        </section>
      </main>
    </div>
  );
}
