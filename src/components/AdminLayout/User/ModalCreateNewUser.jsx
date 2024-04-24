import React, { useState } from "react";
import { Form, Input, Modal, message, notification } from "antd";
import { createNewUser } from "../../../services/UserServices";

const ModalCreateNewUser = (props) => {
  const [form] = Form.useForm();

  const [isSubmit, setIsSubmit] = useState(false);
  const { openModalCreateNewUser, setOpenModalCreateNewUser } = props;

  const onFinish = async (values) => {
    const { fullName, password, phone, email } = values;

    setIsSubmit(true);
    const res = await createNewUser(fullName, password, phone, email);
    if (res && res.data) {
      message.success("Tạo mới người dùng thành công");
      form.resetFields();
      setOpenModalCreateNewUser(false);
      await props.fetchUserList();
    } else {
      notification.error({
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <Modal
      title="Thêm mới người dùng"
      open={openModalCreateNewUser}
      cancelText={"Hủy"}
      okText={"Xác nhận"}
      onCancel={() => setOpenModalCreateNewUser(false)}
      onOk={() => form.submit()}
      confirmLoading={isSubmit}
    >
      <Form name="basic" autoComplete="off" form={form} onFinish={onFinish}>
        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Họ tên không được để trống!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Email"
          name="email"
          rules={[{ required: true, message: "Email không được để trống!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại không được để trống!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateNewUser;
