import React, { useEffect, useState } from "react";
import "../../pages/Carts/Carts.scss";
import { useDispatch, useSelector } from "react-redux";
import { Col, Divider, InputNumber, Row, Steps, Empty } from "antd";
import { DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import {
  doUpdateCartAction,
  doDeteleCartAction,
} from "../../redux/order/orderSlice";

const ViewOrder = (props) => {
  const carts = useSelector((state) => state.order.carts);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);
  const handleOnChangeInput = (value, item) => {
    console.log("changed", value, item);
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: item, _id: item._id })
      );
    }
  };

  return (
    <div className="carts-oder">
      <Row gutter={10}>
        <Col span={18}>
          {carts.length === 0 && (
            <Empty
              style={{
                background: "#fff",
                padding: "100px 100px 300px ",
                marginTop: 10,
                borderRadius: 7,
              }}
              description={"Không có sản phẩm nào trong giỏ hàng"}
            />
          )}
          {carts.map((item, index) => {
            return (
              <div style={{ padding: "10px 0" }} key={`index-${index}`}>
                <div className="carts-order__list">
                  <div style={{ display: "flex" }}>
                    <div className="carts-oder__img">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item.detail.thumbnail
                        }`}
                        alt=""
                      />
                    </div>
                    <div className="info-order">
                      <p className="info-order__text">{item.detail.mainText}</p>
                      <span className="info-order__price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.detail.price)}
                      </span>
                      <InputNumber
                        style={{ width: "15%" }}
                        defaultValue={item.quantity}
                        onChange={(value) => handleOnChangeInput(value, item)}
                      />
                    </div>
                  </div>
                  <div>
                    Tổng :
                    <span
                      style={{
                        color: "#ee4d2d",
                        fontSize: 16,
                        fontWeight: 500,
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price * item.quantity)}
                    </span>
                  </div>
                  <DeleteOutlined
                    style={{ color: "#ff0000" }}
                    onClick={() =>
                      dispatch(doDeteleCartAction({ _id: item._id }))
                    }
                  />
                </div>
              </div>
            );
          })}
        </Col>

        <Col span={6} style={{ marginTop: 10 }} className="carts-total">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
            }}
          >
            Tạm tính :
            <span
              style={{
                color: "#ee4d2d",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "20px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
            }}
          >
            Tổng tiền :
            <span
              style={{
                color: "#ee4d2d",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "20px 0" }} />
          <button onClick={() => props.setCurrentStep(1)}>
            Mua hàng <span>({carts.length ?? 0})</span>
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default ViewOrder;
