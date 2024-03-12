import React, { useEffect, useState } from "react";
import { Form, Input, Modal, message, notification } from "antd";
import { callUpdateUser } from "../../../utils/UserServices";
const UpdateUser = (props) => {
  const [form] = Form.useForm();

  const { showModalUpdate, setShowModalUpdate, dataUpdate, setDataUpdate} = props;

  const [isSubmit, setIsSubmit] = useState(false);
  const onFinish = async (values) => {
    const { _id, fullName, phone } = values;

    setIsSubmit(true);
    const res = await callUpdateUser(_id, fullName, phone);
    if (res && res.data) {
      message.success("Update người dùng thành công");
      setShowModalUpdate(false);
      await props.fetchUserList();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  return (
    <Modal
      title="Update user"
      open={showModalUpdate}
      onOk={() => form.submit()}
      okText="Update"
      onCancel={() => {
        setShowModalUpdate(false);
        setDataUpdate(null);
      }}
      confirmLoading={isSubmit}
      forceRender
    >
      <Form
        name="basic"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item labelCol={{ span: 24 }} label="Id" name="_id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
