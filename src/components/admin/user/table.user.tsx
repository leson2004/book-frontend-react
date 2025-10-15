import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Drawer } from "antd";
import { useRef, useState } from "react";

import { getUsersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import ViewDetailUser from "./viewdetail.user";
import CreateNewUser from "./create.user";
import ImportUser from "./data/upload.user";

type ISearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createRange: string;
};
const TableUser = () => {
  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      search: false,
      title: "id",
      dataIndex: "_id",
      // width:200
      render(dom, entity, index, action, schema) {
        return (
          <a
            onClick={() => {
              setOpenViewDetail(true);
              setDataViewDetail(entity);
            }}
          >
            {entity._id}
          </a>
        );
      },
    },
    {
      title: "Email ",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Full Name ",
      dataIndex: "fullName",
    },
    {
      title: "Create At",
      dataIndex: "createRange",
      valueType: "dateRange",
      hideInTable: true,
    },
    {
      title: "Create At",
      dataIndex: "createdAt",
      valueType: "date",
      hideInSearch: true,
      sorter: true,
    },
    {
      search: false,
      title: "Action",
      render: (text, record) => (
        <>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => console.log(record)}
          >
            <DeleteOutlined style={{ fontSize: "16px", color: "#f57800" }} />
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => console.log(record)}
          >
            <EditOutlined style={{ fontSize: "16px", color: "#ff4d4f" }} />
          </button>
        </>
      ),
    },
    // ở column có thể tạo 2 bảng created at và ẩn đi
    // tạo 1 file để tạo hàm cofig date . trong request tham số params sẽ được gọi sau mỗi lần reset do vậy giá trị trên inout sẽ lấy được từ param
    // từ đó sẽ tạo giá trị query là các kiểu api sẽ truyền vào với điều kiệ khác nhau sẽ api đc gửi và lấy dữ liệu khác nhau .
  ];

  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);
  const [openModalExport, setOpenModalExport] = useState<boolean>(false);
  const [meta, setMeTa] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const refreshTable = () => {
    actionRef.current?.reload();
    setOpenModalCreate(false);
  };
  const actionRef = useRef<ActionType>();

  return (
    <>
      <ProTable<IUserTable, ISearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter); // mỗi lần chạy bảng sẽ chạy qua hàm request này , tham số params sẽ lấy ra
          // giá trị currentPage và pageSize động .
          let query = "";
          if (params) {
            query = `current=${params.current ?? 1}&pageSize=${
              params.pageSize ?? 5
            }`;
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }
            if (params.email) {
              query += `&email=/${params.email}/i`;
            }
            const createDateRange = dateRangeValidate(params.createRange);
            if (createDateRange) {
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`; // tại sao có thể dùng key là 0,1 ??[startDate, endDate];
            }
            // default
            query += `&sort=-createdAt`;

            if (sort && sort.createdAt) {
              query += `&sort=${
                sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
              }`;
            }
          }
          const res = await getUsersAPI(query);
          if (res.data) {
            setMeTa(res.data.meta);
          }
          return {
            // data: data.data,
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
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
        headerTitle="Table user"
        toolBarRender={() => [
          // thêm mới
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              // actionRef.current?.reload();
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
          //upload file excel
          <Button
            key="button"
            icon={<CloudUploadOutlined />}
            onClick={() => {
              // actionRef.current?.reload();
              setOpenModalImport(true);
            }}
            type="primary"
          >
            Upload
          </Button>,
          // export
          <Button
            key="button"
            icon={<ExportOutlined />}
            onClick={() => {
              // actionRef.current?.reload();
              setOpenModalExport(true);
            }}
            type="primary"
          >
            Export
          </Button>,
        ]}
      />
      {/* hiển thị thông tin : detail user  */}
      <ViewDetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      {/* modal tao moi user */}
      <CreateNewUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
      />
    </>
  );
};

export default TableUser;
