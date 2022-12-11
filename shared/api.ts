import { DEFAULT_LIMIT_POSTS } from "./constants";

const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api";

export const getPostsApi = async (page = 1, limit = DEFAULT_LIMIT_POSTS, search: string = "", category: string = "") => {
  let url = `${apiUrl}/posts?page=${page}&limit=${limit}`;

  if (category) url += `&category=${category}`;
  if (search) url += `&search=${search}`;

  const results = await fetch(url);

  return results.json();
};

export const getCategoriesApi = async () => {
  const results = await fetch(
    `${apiUrl}/categories`
  );

  return results.json();
};

export const getPostApi = async (id: number) => {
  const results = await fetch(
    `${apiUrl}/post/${id}`
  );

  return results.json();
};