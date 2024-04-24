import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import { callHistory } from "../../services/UserServices";
import ReactJson from "react-json-view";
import moment from "moment";

const History = () => {
  const [dataHistory, setDataHistory] = useState([]);

  const columns = [
    {
      title: "STT",
      render: (text, index, record) => {
        return <p>{record + 1}</p>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (text, record, index) => {
        return <p>{moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (text, record, index) => {
        return (
          <p>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(record.totalPrice)}
          </p>
        );
      },
    },
    {
      title: "Trạng thái",
      render: () => {
        return <Tag color="success">Thành công</Tag>;
      },
    },
    {
      title: "Chi tiết",
      key: "detail",
      render: (text, index, record) => {
        return (
          <ReactJson
            name="Xem chi tiết"
            src={index.detail}
            enableClipboard={null}
            displayDataTypes={false}
            collapsed={true}
          />
        );
      },
    },
  ];

  useEffect(() => {
    callHistoryOrder();
  }, []);

  const callHistoryOrder = async () => {
    const res = await callHistory();
    if (res && res.data) {
      setDataHistory(res.data);
    }
  };
  return (
    <div style={{ maxWidth: 1440, margin: "0 auto" }}>
      <h3>Lịch sử mua hàng :</h3>
      <Table columns={columns} dataSource={dataHistory} rowKey="_id" />
    </div>
  );
};

export default History;
