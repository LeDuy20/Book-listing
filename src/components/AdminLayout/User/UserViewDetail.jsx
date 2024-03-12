import React from "react";
import { Drawer,Descriptions,Badge } from "antd";
import moment from 'moment'

const UserViewDetail = (props) => {
  const {
    setOpenViewDetail,
    setDataViewDetail,
    openViewDetail,
    dataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false); 
    setDataViewDetail(null);
  };
  return (
    <Drawer
      title="Chức năng xem chi tiết"
      width={"50vw"}
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="User Info" column={2} bordered>
        <Descriptions.Item label="id">{dataViewDetail?._id}</Descriptions.Item>
        <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{dataViewDetail?.phone}</Descriptions.Item>
        <Descriptions.Item label="Role" span={2}><Badge status="processing" text={dataViewDetail?.role} /></Descriptions.Item>
        <Descriptions.Item label="Created At">
        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
        </Descriptions.Item>  
      </Descriptions>
    </Drawer>
  );
};

export default UserViewDetail;
