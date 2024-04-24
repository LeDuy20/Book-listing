import React from "react";
import {
  Row,
  Col,
  Avatar,
  Button,
  message,
  Upload,
  Form,
  Input,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import { changePassword } from "../../services/UserServices";

const ChangePassword = (props) => {
  const { setShowModal } = props;
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { email, oldpass, newpass } = values;

    const res = await changePassword(email, oldpass, newpass);
    if (res && res.data) {
      message.success("Cập nhật mật khẩu thành công !!");
      form.setFieldValue("oldpass", "");
      form.setFieldValue("newpass", "");
      setShowModal(false);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra !",
        description: res.message,
      });
    }
  };

  const user = useSelector((state) => state.account.user);

  return (
    <Row>
      <Col span={12}>
        <Form name="basic" onFinish={onFinish} autoComplete="off" form={form}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            initialValue={user.email}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Old Password"
            name="oldpass"
            rules={[
              { required: true, message: "Please input your old password!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="New Password"
            name="newpass"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ChangePassword;
