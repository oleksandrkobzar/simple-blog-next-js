import { useEffect, useState } from "react";
import Head from "next/head";

import Image from "next/image";
import Link from "next/link";

import { getPostApi } from "../../shared/api";
import { Post as PostInterface, Category } from "../../interfaces";
import PlaceholderImage from '../../assets/images/placeholder.jpg'

interface PostProps {
  post: PostInterface;
}

export async function getServerSideProps({query}: any) {
  const {id} = query;

  const {post} = await getPostApi(id);

  return {props: {post}};
}

export default function Post({post}: PostProps) {
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    setIsImageError(false);
  }, [post.imageUrl])

  return (
    <div className="max-w-screen-xl mx-auto">
      <Head>
        <title>Post page</title>
        <meta name="description" content="Post page"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="px-8 mb-8">
        <div className="relative pb-[56.25%] mb-4">
          <Image
            src={isImageError ? PlaceholderImage: post.imageUrl}
            alt={post.title}
            fill
            objectFit="cover"
            loading="lazy"
            onError={() => setIsImageError(true)}
          />
        </div>
        <div className="flex gap-2 mb-2 justify-center">
          {post.categoriesList && post.categoriesList.map((category: Category, key) =>
            <Link href={`/?category=${category.id}`} key={key} className="text-blue-600 font-medium">
              {category.name}
            </Link>
          )}
        </div>
        <h2 className="mb-4 font-bold text-center text-3xl">{post.title}</h2>
        <p className="text-base text-center max-w-md m-auto mb-8 text-gray-500">
          {post.excerpt}
        </p>
      </main>
    </div>
  );
}
