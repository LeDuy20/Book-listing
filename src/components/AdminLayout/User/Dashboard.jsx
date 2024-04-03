import React, { useState, useEffect } from "react";
import CountUp from 'react-countup';
import {Row, Col, Card, Statistic } from "antd";
import { callFetchDashboard } from "../../../utils/UserServices";

const Dashboard = () => {
  const [dataDashboard , setDataDashboard] = useState({
    countUser: 0 , countOrder: 0});
  console.log(dataDashboard)

  useEffect(() => {
    const initData = async () => {
      const res = await callFetchDashboard();
      console.log(res)
      if(res && res.data) setDataDashboard(res.data)
    };
    initData()
  }, [])
  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <Row gutter={[40, 40]}>
      <Col span={10}>
        <Card title="" bordered={false}>
          <Statistic title="Tổng người dùng" value={dataDashboard.countUser} formatter={formatter}  />
        </Card>
      </Col>
      <Col span={10}>
        <Card title="" bordered={false}>
          <Statistic title="Tổng đơn hàng" value={dataDashboard.countOrder} formatter={formatter} />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
