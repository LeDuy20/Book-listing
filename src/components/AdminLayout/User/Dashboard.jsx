import React from "react";
//import CountUp from 'react-countup';
import {Row, Col, Card, Statistic } from "antd";

const Dashboard = () => {
  //const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <Row gutter={[40, 40]}>
      <Col span={10}>
        <Card title="" bordered={false}>
          <Statistic title="Tổng người dùng" value={112893}  />
        </Card>
      </Col>
      <Col span={10}>
        <Card title="" bordered={false}>
          <Statistic title="Tổng đơn hàng" value={112893}  />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
