import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    image_url?: string;
    name?: string;
    href?: string;
}

const CategoryCard = ({image_url = "", name, href="/"}: Props) => {
  return (
    <Link
      className="bg-white dark:bg-neutral-700 rounded-2xl p-2 transform transition-transform duration-300 hover:scale-105"
      href={href}
    >
      <Image src={image_url} width={180} height={180} alt="Category image" />
      <div className="text-center pb-2">{name}</div>
    </Link>
  );
}

export default CategoryCard