import type { NextApiRequest, NextApiResponse } from "next";
import { Category } from "../../interfaces";
import mockData from "../../json/blog.json";

interface CategoriesApiResponse {
  categories: Array<Category>;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoriesApiResponse>
) {

  res.status(200).json({
    categories: mockData.categories,
  });
}
