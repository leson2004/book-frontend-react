import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import { Row, Col, Rate, Divider, InputNumber, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import { useCurrentApp } from "components/context/app.context";

import "react-image-gallery/styles/css/image-gallery.css";
import "@/styles/book.scss";
import ModalGallery from "./model.gallery";
interface IProps {
  dataBook: IBooks | null;
}

type UserAction = "MINUS" | "PLUS";
const DetailBook = (props: IProps) => {
  const { dataBook } = props;

  const { carts, setCarts } = useCurrentApp();
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
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  const refGallery = useRef<ImageGallery>(null);

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
  // handle
  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const handleChangeButton = (type: UserAction) => {
    if (type === "MINUS") {
      if (currentQuantity - 1 <= 0) {
        return;
      }
      setCurrentQuantity(currentQuantity - 1);
    }
    if (type === "PLUS" && dataBook) {
      if (currentQuantity + 1 === +dataBook?.quantity) return; //max nếu gtri htai bằng số lượng thì dừng
      setCurrentQuantity(currentQuantity + 1);
    }
  };
  const handleChangeInput = (value: string) => {
    if (!isNaN(+value)) {
      if (+value > 0 && dataBook && +value < +dataBook.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };
  const handleAddCarts = () => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && dataBook) {
      //update carts
      const carts = JSON.parse(cartStorage) as ICarts[];
      let isExistIndex = carts.findIndex((item) => item._id === dataBook?._id);
      //check exist
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + currentQuantity;
      } else {
        carts.push({
          _id: dataBook?._id,
          quantity: currentQuantity,
          detail: dataBook,
        });
      }
      localStorage.setItem("carts", JSON.stringify(carts));
      setCarts(carts);
    } else {
      // tạo mới
      const data = [
        { _id: dataBook?._id!, quantity: currentQuantity, detail: dataBook! },
      ];
      localStorage.setItem("carts", JSON.stringify(data));
      setCarts(data);
    }
  };
  console.log(carts);
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
                  <button onClick={() => handleChangeButton("MINUS")}>
                    <MinusOutlined />
                  </button>
                  <Input
                    onChange={(e) => {
                      handleChangeInput(e.target.value);
                    }}
                    value={currentQuantity}
                  />
                  <button onClick={() => handleChangeButton("PLUS")}>
                    <PlusOutlined />
                  </button>
                </span>
              </div>

              <div className="buy">
                <button className="cart" onClick={() => handleAddCarts()}>
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
