import React, { useEffect, useState } from "react";

import { Tag, Space, Table, Divider, Drawer } from "antd";
import type { TableProps } from "antd";
import { getOrderHistory } from "@/services/api";
import dayjs from "dayjs";
import { FORMAT_DATE_VN } from "@/services/helper";

const HistoryPage = () => {
  const columns: TableProps<IOrderHistory>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (item, record, index) => {
        return dayjs(item).format(FORMAT_DATE_VN);
      },
    },
    {
      title: "Tổng số tiền ",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (item, record, index) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item);
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: () => {
        return <Tag color={"green"}>Thành công</Tag>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setDataDetail(record);
              setOpenDetail(true);
            }}
          >
            Xem chi tiết
          </a>
        </Space>
      ),
    },
  ];
  const [dataHistory, setDataHistory] = useState<IOrderHistory[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<IOrderHistory | null>(null);
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await getOrderHistory();
      if (res && res.data) {
        setDataHistory(res.data);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div style={{ margin: 50 }}>
      <div>Lịch sử đơn hàng</div>
      <Divider />
      <Table bordered columns={columns} dataSource={dataHistory} />
      <Drawer
        title="Chi tiết đơn hàng"
        onClose={() => {
          setOpenDetail(false);
          setDataDetail(null);
        }}
        open={openDetail}
        // width={720}
      >
        {dataDetail?.detail?.map((item, index) => {
          return (
            <ul key={index}>
              <li>Tên sách : {item.bookName}</li>
              <li>Số lượng : {item.quantity}</li>
              <Divider />
            </ul>
          );
        })}
      </Drawer>
    </div>
  );
};

export default HistoryPage;
