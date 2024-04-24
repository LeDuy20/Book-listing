import React, { useState, useEffect } from "react";
import { Table, message, notification } from "antd";
import { callListOrder } from "../../../services/UserServices";
import moment from "moment";

const ManageOder = () => {
  const [listOrder, setListOrder] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  //Sort
  const [sortQuery, setSortQuery] = useState("");

  useEffect(() => {
    fetchUserOrder();
  }, [current, pageSize, total]);

  const fetchUserOrder = async () => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    const res = await callListOrder(query);
    if (res && res.data) {
      setListOrder(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };
  //columns
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true);
              setDataViewDetail(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      sorter: true,
    },
    {
      title: "Tên hiển thị",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Ngày cập nhập",
      dataIndex: "createdAt",
      sorter: true,
      render: (text, record, index) => {
        return <p>{moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>;
      },
    },
  ];
  return (
    <Table
      style={{ padding: "20px 0" }}
      columns={columns}
      dataSource={listOrder}
      //onChange={onChange}
      rowKey="_id"
      loading={loading}
      pagination={{
        current: current,
        pageSize: pageSize,
        showSizeChanger: true,
        total: total,
      }}
    />
  );
};

export default ManageOder;
