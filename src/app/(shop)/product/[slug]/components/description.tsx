import React from "react";

type Props = {
  description: string | null;
};

const ProductDescription = (props: Props) => {
  // Kiểm tra nếu description là rỗng hoặc undefined
  if (!props.description) {
    return (
      <div className="text-gray-500">Không có thông tin mô tả sản phẩm</div>
    );
  }

  return (
    <div
      className="prose max-w-none prose-img:my-2 prose-img:rounded-lg prose-img:mx-auto prose-img:max-w-full"
      dangerouslySetInnerHTML={{ __html: props.description }}
    />
  );
};

export default ProductDescription;
