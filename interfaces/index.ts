export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  categories: Array<number>;
  categoriesList: Array<Category>;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
}