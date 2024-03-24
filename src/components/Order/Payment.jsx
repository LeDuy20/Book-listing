import React, { useEffect, useState } from "react";
import "../../pages/Carts/Carts.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  InputNumber,
  Empty,
  Form,
  Input,
  Radio,
  message,
  notification,
} from "antd";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  doUpdateCartAction,
  doDeteleCartAction,
  doDeleteCartsAfterOrder,
} from "../../redux/order/orderSlice";
import { callUserCarts } from "../../utils/UserServices";

const { TextArea } = Input;

const Payment = (props) => {
  const [form] = Form.useForm();
  const carts = useSelector((state) => state.order.carts);
  const user = useSelector((state) => state.account.user);
  console.log(user)
  const [totalPrice, setTotalPrice] = useState(0);
  const [value, setValue] = useState(1);
  const [isSubmit, setIsSubmit] = useState(false);
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
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: item, _id: item._id })
      );
    }
  };
  const onFinish = async (value) => {
    setIsSubmit(true);
    const detailOrder = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const data = {
      name: value.name,
      address: value.address,
      phone: value.phone,
      totalPrice: totalPrice,
      detail: detailOrder,
    };

    const res = await callUserCarts(data);
    if (res && res.data) {
      message.success("Đặt hàng thành công!!!");
      dispatch(doDeleteCartsAfterOrder());
      props.setCurrentStep(2);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <div className="carts-oder" style={{ display: "flex", gap: 10 }}>
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
      {carts && (
        <Col
          span={6}
          style={{
            marginTop: 10,
            padding: 20,
            backgroundColor: "#fff",
            borderRadius: 7,
          }}
          className="carts-address"
        >
          <Form onFinish={onFinish} form={form}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              label="Tên người nhận"
              name="name"
              initialValue={user?.fullName}
              rules={[{ required: true, message: "Tên không được để trống!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              label="Id"
              name="id"
              initialValue={user?.id}
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              label="Số điện thoại"
              name="phone"
              initialValue={user?.phone}
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Địa chỉ không được để trống!",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item labelCol={{ span: 24 }} label="Hình thức thanh toán">
              <Radio.Group value={value}>
                <Radio value={1}>Thanh toán Khi nhận hàng</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
            }}
          >
            <span>Tổng tiền :</span>
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
              }).format(totalPrice ?? 0)}
            </span>
          </div>

          <button onClick={() => form.submit()} disabled={isSubmit}>
            {isSubmit && (
              <span>
                <LoadingOutlined /> &nbsp;
              </span>
            )}
            Mua hàng <span>({carts.length ?? 0})</span>
          </button>
        </Col>
      )}
    </div>
  );
};

export default Payment;
