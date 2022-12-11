import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Category, Post } from "../interfaces";
import PlaceholderImage from "../assets/images/placeholder.jpg"

interface PostTileProps {
  post: Post;
}

export default function PostTile({post}: PostTileProps) {
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    setIsImageError(false);
  }, [post.imageUrl])

  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-lg shadow-gray-200 transition-transform hover:-translate-y-1 ease-in-out">
      <div className="relative pb-[56.25%]">
        <Image
          src={isImageError ? PlaceholderImage : post.imageUrl}
          alt={post.title}
          fill
          objectFit="cover"
          loading="lazy"
          onError={() => setIsImageError(true)}
        />
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {post.categoriesList && post.categoriesList.map((category: Category, key) =>
            <Link href={`?category=${category.id}`} key={key} className="text-blue-600 font-medium">
              {category.name}
            </Link>
          )}
        </div>
        <h3 className="mb-4 font-bold">
          <Link href={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        <p className="mb-4 text-base text-gray-500">{post.excerpt}</p>
      </div>
    </div>
  );
}
