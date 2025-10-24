import { getBookAPI } from "@/services/api";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";

import ViewDetailBook from "./view.book";
import CreateBook from "./create.book";

// import {request} from 'umi-request';

function TableBook() {
  const actionRef = useRef<ActionType>();
  const [meta, setMeTa] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBooks | null>(null);
  const [openModalAddBook, setOpenModalAddBook] = useState<boolean>(false);
  const columns: ProColumns<IBooks>[] = [
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
        return (
          <a
            onClick={() => {
              setOpenViewDetail(true);
              console.log("e", entity);
              setDataViewDetail(entity);
            }}
          >
            {entity._id}
          </a>
        );
      },
    },

    {
      title: "Tên Sách",
      dataIndex: "mainText",
      //valueType: "date",
      // copyable: true,
      // ellipsis: true,
      sorter: true,
    },
    {
      title: "Thể loại ",
      dataIndex: "category",
      hideInSearch: true,
    },
    {
      title: "Tác Giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: " Ngày Cập Nhật",
      dataIndex: "updatedAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
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
          >
            <EditOutlined style={{ fontSize: "16px", color: "#ff4d4f" }} />
          </button>
          <Popconfirm
            title="Delete User"
            description="Are you sure to delete this user?"
            //onConfirm={"confirm"}
            //onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <DeleteOutlined style={{ fontSize: "16px", color: "#f57800" }} />
            </button>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <>
      <ProTable<IBooks>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter); // mỗi lần chạy bảng sẽ chạy qua hàm request này , tham số params sẽ lấy ra
          // giá trị currentPage và pageSize động .
          let query = `?current=${params.current ?? 1}&pageSize=${
            params.pageSize ?? 10
          }`;
          if (params) {
            if (params.author) {
              query += `&author=/${params.author}/i`;
            }
            if (params.mainText) {
              query += `&author=/${params.mainText}/i`;
            }
          }
          const res = await getBookAPI(query);
          if (res.data) {
            setMeTa(res.data.meta);
          }
          return {
            //    data: data.data,
            data: res.data?.result,
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
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              //actionRef.current?.reload();
              setOpenModalAddBook(true);
            }}
            type="primary"
          >
            Add New
          </Button>,
        ]}
      />
      <ViewDetailBook
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <CreateBook
        openModalAddBook={openModalAddBook}
        setOpenModalAddBook={setOpenModalAddBook}
      />
    </>
  );
}

export default TableBook;
