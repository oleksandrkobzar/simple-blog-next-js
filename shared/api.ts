const apiUrl = "http://localhost:3000/api";

export const getPostsApi = async (page = 1, limit = 6, search = "", category = null) => {
  let url = `${apiUrl}/posts?page=${page}&limit=${limit}`

  if (category) url += `&category=${category}`;
  if (search) url += `&search=${search}`;

  const results = await fetch(url);

  return results.json();
}

export const getCategoriesApi = async () => {
  const results = await fetch(
    `${apiUrl}/categories`
  );

  return results.json();
}

export const getPostApi = async (id: number) => {
  const results = await fetch(
    `${apiUrl}/post/${id}`
  );

  return results.json();
}