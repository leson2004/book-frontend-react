import DetailBook from "@/components/client/book/book.detail";
import { getBookById } from "@/services/api";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BookLoader from "@/components/client/book/book.loader";
const BookPage = () => {
  const [dataBook, setDataBook] = useState<IBooks | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const { id } = useParams();
  useEffect(() => {
    console.log("id", id);
    if (id) {
      getDetailBook(id);
    }
  }, [id]);
  const getDetailBook = async (id: string) => {
    setIsLoading(true);
    const res = await getBookById(id);
    if (res && res.data) {
      setDataBook(res.data);
    } else {
      message.error("fail to get detail book");
    }
    setIsLoading(false);
  };
  return (
    <div>{isLoading ? <BookLoader /> : <DetailBook dataBook={dataBook} />}</div>
  );
};
export default BookPage;
