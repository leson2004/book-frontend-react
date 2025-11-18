import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import { Row, Col, Rate, Divider } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import "react-image-gallery/styles/css/image-gallery.css";
import "@/styles/book.scss";
import ModalGallery from "./model.gallery";
interface IProps {
  dataBook: IBooks | null;
}
const DetailBook = (props: IProps) => {
  const { dataBook } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass: string;
      thumbnailClass: string;
    }[]
  >([]);
  const refGallery = useRef<ImageGallery>(null);

  // useEffect(() => {
  //   let arrListImg = [];
  // }, [dataBook]);
  // const images = [
  //   {
  //     original: "https://picsum.photos/id/1018/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1018/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1015/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1015/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1019/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1019/250/150/",
  //   },
  // ];
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // const images =
  //   dataBook?.slider && dataBook?.thumbnail
  //     ? [
  //         {
  //           original: `${baseURL}/images/book/${dataBook.thumbnail}`,
  //           thumbnail: `${baseURL}/images/book/${dataBook.thumbnail}`,
  //         },
  //         ...dataBook.slider.map((img) => ({
  //           original: `${baseURL}/images/book/${img}`,
  //           thumbnail: `${baseURL}/images/book/${img}`,
  //         })),
  //       ]
  //     : [];
  useEffect(() => {
    let arrImages = [];
    if (dataBook?.thumbnail) {
      arrImages.push({
        original: `${baseURL}/images/book/${dataBook.thumbnail}`,
        thumbnail: `${baseURL}/images/book/${dataBook.thumbnail}`,
        originalClass: "original-image",
        thumbnailClass: "thumbnail-image",
      });
    }
    if (dataBook?.slider && dataBook?.slider.length > 0) {
      dataBook.slider.map((item) => {
        arrImages.push({
          original: `${baseURL}/images/book/${item}`,
          thumbnail: `${baseURL}/images/book/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      });
    }
    setImages(arrImages);
  }, [dataBook]);
  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  return (
    <>
      <div className="detail-container">
        <div className="detail-wrapper">
          <Row gutter={[20, 20]}>
            <Col md={10} sm={24} xs={24}>
              <ImageGallery
                ref={refGallery}
                items={images}
                showPlayButton={false}
                showFullscreenButton={false}
                renderLeftNav={() => <></>}
                renderRightNav={() => <></>}
                slideOnThumbnailOver={true}
                onClick={() => handleOnClickImage()}
              />
            </Col>

            <Col md={14} sm={24} xs={24}>
              <div className="author">
                Tác giả: <a href="#">{dataBook?.author}</a>
              </div>

              <div className="title">{dataBook?.mainText}</div>

              <div className="rating">
                <Rate
                  value={5}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="sold">
                  <Divider type="vertical" />
                  Đã bán {dataBook?.sold}
                </span>
              </div>

              <div className="price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(dataBook?.price ?? 0)}
              </div>

              <div className="delivery">
                <span className="left">Vận chuyển</span>
                <span className="right">Miễn phí vận chuyển</span>
              </div>

              <div className="quantity">
                <span className="left">Số lượng</span>
                <span className="right qty-box">
                  <button>
                    <MinusOutlined />
                  </button>
                  <input defaultValue={1} />
                  <button>
                    <PlusOutlined />
                  </button>
                </span>
              </div>

              <div className="buy">
                <button className="cart">
                  <BsCartPlus className="icon-cart" />
                  <span>Thêm giỏ hàng</span>
                </button>
                <button className="now">Mua ngay</button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={images}
      />
    </>
  );
};

export default DetailBook;
