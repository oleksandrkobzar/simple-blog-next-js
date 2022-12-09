import type { NextApiRequest, NextApiResponse } from "next";
import { Category, Post } from "../../interfaces";
import mockData from "../../json/blog.json";

interface PostsApiResponse {
  posts: Array<Post>
  pageCount: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostsApiResponse>
) {
  const {page, limit, search, category} = req.query;

  if (!page || !limit) {
    res.status(400);
  }

  let posts = mockData.posts;
  const categories = mockData.categories;

  if (search) {
    if (typeof search === "string") {
      posts = posts.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()));
    }
  }

  if (category) {
    posts = posts.filter((post) => post.categories.includes(Number(category)));
  }

  const indexOfLastPost = page * limit;
  const indexOfFirstPost = indexOfLastPost - limit;
  const pageCount = Math.ceil(posts.length / limit);
  const _posts = posts.slice(indexOfFirstPost, indexOfLastPost);

  _posts.forEach(element => {
    const listOfCategories: Array<Category> = []
    element.categories.forEach(categoryId => {
      listOfCategories.push(...categories.filter(category => category.id === categoryId))
    })

    element.categoriesList = listOfCategories;
  })

  res.status(200).json({
    posts: _posts,
    pageCount: pageCount,
  });
}
