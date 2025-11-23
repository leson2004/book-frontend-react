import OrderDetail from "@/components/client/order";
import Payment from "@/components/client/order/payment";
import { Steps } from "antd";
import { useState } from "react";

const OrderPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div style={{ background: "#efefef", padding: "20px 0 " }}>
      <div
        style={{
          margin: "0 50px",
          padding: "20px 50px",
          background: "#fff",
          borderRadius: "15px",
        }}
      >
        <Steps
          current={currentStep}
          items={[
            {
              title: "Đơn Hàng",
            },
            {
              title: "Đặt Hàng",
            },
            {
              title: "Thanh Toán ",
            },
          ]}
        />
      </div>
      <div>
        {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
        {currentStep === 1 && (
          <Payment setCurrentStep={setCurrentStep} currentStep={currentStep} />
        )}
      </div>
    </div>
  );
};
export default OrderPage;
