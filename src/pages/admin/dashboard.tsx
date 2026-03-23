import { Card, Flex } from "antd";
import { Col, Row, Statistic } from "antd";
import type { StatisticProps } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { getDashboardData } from "@/services/api";
const DashBoardPage = () => {
  const [dataDashboard, setDataDashboard] = useState<IDashboard | null>(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await getDashboardData();
      if (res && res.data) {
        setDataDashboard(res.data);
      }
    };
    fetchDashboardData();
  }, []);
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," />
  );
  return (
    <>
      <Flex gap={20} wrap="wrap">
        <Card style={{ width: 350 }}>
          <Col span={12}>
            <Statistic
              title="Tổng User"
              value={dataDashboard?.countUser}
              formatter={formatter}
            />
          </Col>
        </Card>
        <Card style={{ width: 350 }}>
          <Col span={12}>
            <Statistic
              title="Tổng Đơn Hàng"
              value={dataDashboard?.countOrder}
              formatter={formatter}
            />
          </Col>
        </Card>
        <Card style={{ width: 350 }}>
          <Col span={12}>
            <Statistic
              title="Tổng Books"
              value={dataDashboard?.countBook}
              formatter={formatter}
            />
          </Col>
        </Card>
      </Flex>
    </>
  );
};

export default DashBoardPage;
