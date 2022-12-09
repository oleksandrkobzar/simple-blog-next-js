import type { NextApiRequest, NextApiResponse } from "next";
import { Category, Post } from "../../../interfaces";
import mockData from "../../../json/blog.json";

interface PostApiResponse {
  post: Post
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostApiResponse>
) {
  const {id} = req.query;

  let posts = mockData.posts;
  let categories = mockData.categories;

  const post = posts.filter(post => post.id === Number(id))[0];

  const listOfCategories: Array<Category> = []
  post.categories.forEach(categoryId => {
    listOfCategories.push(...categories.filter(category => category.id === categoryId))
  })

  const _post = {
    ...post,
    categoriesList: listOfCategories
  };

  res.status(200).json({
    post: _post,
  });
}
