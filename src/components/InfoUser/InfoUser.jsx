import React from "react";
import { Modal, Tabs } from "antd";
import ChangeInfoUser from "./ChangeInfoUser";
import ChangePassword from "./ChangePassword";

const InfoUser = (props) => {
  const { setShowModal, showModal } = props;

  const items = [
    {
      key: "1",
      label: "Chỉnh sửa thông tin",
      children: <ChangeInfoUser />,
    },
    {
      key: "2",
      label: "Thay đổi mật khẩu",
      children: <ChangePassword setShowModal={setShowModal}/>,
    },
  ];

  return (
    <Modal
      title="Quản lí tài khoản"
      open={showModal}
      onCancel={() => setShowModal(false)}
      maskClosable={false}
      footer={null}
      width={"50vw"}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};

export default InfoUser;
