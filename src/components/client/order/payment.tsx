import { useEffect, useState } from "react";
import { Form, Input, Radio, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";

import "@/styles/order.scss";
import { useCurrentApp } from "@/components/context/app.context";
import { createOrder } from "@/services/api";
type IProps = {
  currentStep: number;
  setCurrentStep: (v: number) => void;
};
type FieldType = {
  fullName: string;
  phone: string;
  method: string;
  address: string;
};
const Payment = (props: IProps) => {
  const { carts, setCarts, user } = useCurrentApp();
  const { setCurrentStep, currentStep } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleDeleteProduct = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      const cart = JSON.parse(cartStorage) as ICarts[];
      const newCart = cart.filter((item) => item._id !== _id);
      setCarts(newCart);
      localStorage.setItem("carts", JSON.stringify(newCart));
    }
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values) {
      const { fullName, phone, address, method } = values;
      const detailOrder = carts.map((item) => {
        return {
          bookName: item.detail.mainText,
          quantity: item.quantity,
          _id: item.detail._id,
        };
      });
      setIsLoading(true);
      const res = await createOrder(
        fullName,
        address,
        phone,
        totalPrice,
        method,
        detailOrder
      );
      if (res && res.data) {
        setCurrentStep(2);
        setCarts([]);
        localStorage.removeItem("carts");
      } else {
        message.error("có lỗi xảy ra ở sever");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="view-cart-container">
      <div className="view-cart-left">
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

            <div className="qty">Số lượng: {book.quantity}</div>

            <div className="total">
              Tổng:{" "}
              {new Intl.NumberFormat("vi-VN").format(
                book.detail.price * book.quantity
              )}{" "}
              đ
            </div>

            <div onClick={() => handleDeleteProduct(book._id as string)}>
              <DeleteOutlined className="delete-icon" />
            </div>
          </div>
        ))}
        <Button onClick={() => setCurrentStep(currentStep - 1)}>
          Quay trở lại
        </Button>
      </div>

      {/* right form */}
      <div className="checkout-box">
        <h3>Hình thức thanh toán</h3>

        <Form
          layout="vertical"
          initialValues={{
            method: "COD",
            fullName: user?.fullName || "",
            phone: user?.phone || "",
            address: "",
          }}
          onFinish={onFinish}
        >
          {/* PAYMENT */}
          <Form.Item<FieldType> name="method" style={{ marginBottom: "3px" }}>
            <Radio.Group className="pay-method">
              <Radio value="COD">Thanh toán khi nhận hàng</Radio>
              <Radio value="BANKING">Chuyển khoản ngân hàng</Radio>
            </Radio.Group>
          </Form.Item>

          {/* FULL NAME */}
          <Form.Item<FieldType>
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            style={{ marginTop: "5px" }}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          {/* PHONE */}
          <Form.Item<FieldType>
            label=" Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{9,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {/* ADDRESS */}
          <Form.Item<FieldType>
            label=" Địa chỉ nhận hàng"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập địa chỉ nhận hàng" />
          </Form.Item>

          {/* SUMMARY */}
          <div className="summary">
            <div className="row">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString()} đ</span>
            </div>

            <div className="row total">
              <span>Tổng tiền</span>
              <span className="highlight">{totalPrice.toLocaleString()} đ</span>
            </div>
          </div>

          {/* BUTTON */}
          <Button
            htmlType="submit"
            style={{ width: "100%", marginTop: "15px" }}
            color="danger"
            variant="solid"
            loading={isLoading}
          >
            Đặt Hàng ({carts.length})
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Payment;
