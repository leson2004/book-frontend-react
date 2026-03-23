import { useEffect, useState } from "react";
import { Button, Empty, InputNumber, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import "@/styles/order.scss";
import { useCurrentApp } from "@/components/context/app.context";

type IProps = {
  setCurrentStep: (v: number) => void;
};
const OrderDetail = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    if (carts && carts.length > 0) {
      const totalTemp = carts.reduce((sum, item) => {
        return sum + item.detail.price * item.quantity;
      }, 0);
      setTotalPrice(totalTemp);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);
  const handleChangeQuantity = (value: number, book: IBooks) => {
    if (!value || +value < 1) return;
    if (!isNaN(+value)) {
      //update quantity
      const cartStorage = localStorage.getItem("carts");
      if (cartStorage && book) {
        const cart = JSON.parse(cartStorage) as ICarts[];
        //check exist
        let isExistIndex = cart.findIndex((c) => c._id === book._id);
        if (isExistIndex > -1) {
          cart[isExistIndex].quantity = value;
        }
        localStorage.setItem("carts", JSON.stringify(cart));
        setCarts(cart);
      }
    }
  };
  const handleDeleteProduct = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      const cart = JSON.parse(cartStorage) as ICarts[];
      const newCart = cart.filter((item) => item._id !== _id);
      setCarts(newCart);
      localStorage.setItem("carts", JSON.stringify(newCart));
    }
  };
  const handleNextSteps = () => {
    if (!carts.length) {
      message.error("sản phẩm không tồn tại trong giỏ hàng ");
      return;
    }
    setCurrentStep(1);
  };
  return (
    <div className="view-cart-container">
      <div className="view-cart-left">
        <div>
          {carts.map((book, index) => (
            <div className="cart-item" key={index}>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                  book.detail.thumbnail
                }`}
                alt="book"
                className="book-img"
              />

              <div className="book-info">
                <h4>{book.detail.mainText}</h4>
                <span className="price">
                  {new Intl.NumberFormat("vi-VN").format(book.detail.price)} đ
                </span>
              </div>

              <div className="qty-box">
                <InputNumber
                  min={1}
                  max={99}
                  value={book.quantity}
                  onChange={(value) =>
                    handleChangeQuantity(value as number, book.detail)
                  }
                />
              </div>

              <div className="total">
                Tổng:{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  book.detail.price * book.quantity,
                )}{" "}
                đ
              </div>

              <div onClick={() => handleDeleteProduct(book._id as string)}>
                <DeleteOutlined className="delete-icon" />
              </div>
            </div>
          ))}
        </div>
        {carts.length < 1 && (
          <Empty description="không có sản phẩm trong giỏ hàng" />
        )}
      </div>

      <div className="view-cart-right">
        <div className="summary-box">
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{new Intl.NumberFormat("vi-VN").format(totalPrice)} đ</span>
          </div>

          <div className="summary-row total-money">
            <span>Tổng tiền</span>
            <span>{new Intl.NumberFormat("vi-VN").format(totalPrice)} đ</span>
          </div>

          <Button
            color="danger"
            variant="solid"
            className="btn-checkout"
            onClick={() => handleNextSteps()}
          >
            Mua Hàng ({carts.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
