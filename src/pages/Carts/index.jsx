import React, { useState } from "react";
//import "./Carts.scss";
import { Steps } from "antd";
import ViewOrder from "../../components/Order/ViewOrder";
import Payment from "../../components/Order/Payment";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  return (
    <div style={{ background: "#ccc" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        <div style={{ padding: '20px 0'}}>
          <div>
            <Steps
              style={{ background: "#fff", padding: 20, borderRadius: 7 }}
              size="small"
              current={currentStep}
              status="finish"
              items={[
                {
                  title: "Đơn hàng",
                },
                {
                  title: "Đặt hàng",
                },
                {
                  title: "Thanh toán",
                },
              ]}
            />
            {currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />}
            {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
            {currentStep === 2 && (
              <Result
                //style={{ background: "#fff", padding: 100, borderRadius: 7, marginTop: 10 }}
                icon={<SmileOutlined />}
                setCurrentStep={setCurrentStep}
                title="Đã đặt hàng thành công !!!"
                extra={<Button type="primary" style={{ width: 120}} onClick={() => navigate('/history')} >Xem lịch sử</Button>}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
