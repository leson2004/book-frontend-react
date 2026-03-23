import { deleteBookAPI, getBookAPI, getListOrder } from "@/services/api";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import { useRef, useState } from "react";

import { dateRangeValidate } from "@/services/helper";

// import {request} from 'umi-request';
type TSearch = {
  name: string;
  address: string;
  totalPrice: number;
  createdAt: Date;
};
function ManageOrder() {
  const actionRef = useRef<ActionType>();
  const [meta, setMeTa] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [currentDataTable, setCurrentDataTable] = useState<IOrder[]>([]);

  const refreshTable = () => {
    actionRef.current?.reload();
  };
  const columns: ProColumns<IOrder>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "id",
      dataIndex: "title",
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <a>{entity._id}</a>;
      },
    },

    {
      title: "Full Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Địa chỉ ",
      dataIndex: "address",
    },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: " CreateAt",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
  ];
  return (
    <>
      <ProTable<IOrder, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter); // mỗi lần chạy bảng sẽ chạy qua hàm request này , tham số params sẽ lấy ra
          // giá trị currentPage và pageSize động .

          let query = "";
          if (params) {
            query += `?current=${params.current}&pageSize=${params.pageSize}`;
            if (params.name) {
              query += `&author=/${params.name}/i`;
            }
            if (params.address) {
              query += `&author=/${params.address}/i`;
            }
            const createDateRange = dateRangeValidate(params.createdAt);
            if (createDateRange) {
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            }
          }
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else {
            query += `&sort=-createdAt`;
          }

          if (sort && sort.name) {
            query += `&sort=${sort.name === "ascend" ? "name" : "-name"}`;
          }

          if (sort && sort.address) {
            query += `&sort=${sort.address === "ascend" ? "address" : "-address"}`;
          }

          if (sort && sort.totalPrice) {
            query += `&sort=${sort.totalPrice === "ascend" ? "totalPrice" : "-totalPrice"}`;
          }
          console.log("q", query);
          const res = await getListOrder(query);
          // console.log("res", res);
          if (res.data) {
            setMeTa(res.data.meta);
            setCurrentDataTable(res.data.result ?? []);
          }
          return {
            //    data: data.data,
            data: res.data?.result || [],
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} -{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        dateFormatter="string"
        headerTitle="Table Book"
      />
    </>
  );
}

export default ManageOrder;
