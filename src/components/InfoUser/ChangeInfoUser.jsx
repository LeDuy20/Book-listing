import React, { useEffect, useState } from "react";
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
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { callUploadUser, callUploadAvatar } from "../../utils/UserServices";
import { useDispatch, useSelector } from "react-redux";
import {
  doUpdateUserInfoAction,
  doUploadAvatarAction,
} from "../../redux/account/accountSlice";

const ChangeInfoUser = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.account.user);
  const [isSubmit, setIsSubmit] = useState(false);

  const dispatch = useDispatch();

  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
  const tempAvatar = userAvatar;

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    tempAvatar || user.avatar
  }`;

  //handle upload avatar
  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const res = await callUploadAvatar(file);
    if (res && res.data) {
      const newAvatar = res.data.fileUploaded;
      dispatch(doUploadAvatarAction({ avatar: newAvatar }));
      setUserAvatar(newAvatar);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra khi upload file");
    }
  };

  //Upload avatar
  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadAvatar,
    onChange(info) {
      if (info.file.status) {
      }
      if (info.file.status === "done") {
        message.success(`File uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`File upload failed.`);
      }
    },
  };

  //onFinish form
  const onFinish = async (values) => {
    const { _id, fullName, phone } = values;

    setIsSubmit(true);

    const res = await callUploadUser(_id, fullName, phone, userAvatar);
    if (res && res.data) {
      //update redux
      dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }));
      message.success("Cập nhập người dùng thành công !!");

      //force renew token
      localStorage.removeItem("access_token");
    } else {
      notification.error({
        message: "Đã xảy ra lỗi !!!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);

  return (
    <div style={{ minHeight: 400 }}>
      <Row>
        <Col sm={24} md={12}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Avatar
                size={{ xs: 32, sm: 64, md: 80, lg: 120, xl: 160, xxl: 160 }}
                icon={<UserOutlined />}
                src={urlAvatar}
              />
            </Col>
            <Col span={24}>
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Col>
          </Row>
        </Col>
        <Col sm={24} md={12}>
          <Form name="basic" onFinish={onFinish} autoComplete="off" form={form}>
            <Form.Item label="ID" name="id">
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Tên đầy đủ"
              name="fullName"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your Phone!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                loading={isSubmit}
                type="primary"
                htmlType="submit"
                onClick={() => form.submit()}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ChangeInfoUser;
