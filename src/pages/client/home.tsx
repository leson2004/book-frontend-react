import React, { useState, useEffect } from "react";
import {
  Layout,
  Tabs,
  Pagination,
  Row,
  Col,
  Card,
  Rate,
  Checkbox,
  Button,
  InputNumber,
  Divider,
  message,
  Form,
} from "antd";

import "@/styles/home.scss";
import type { PaginationProps, FormProps } from "antd";
import { Spin } from "antd";
import { useNavigate } from "react-router";

import { getBookAPI, getCategoryAPI } from "@/services/api";

const { Content } = Layout;
type FieldType = {
  range: {
    from: number;
    to: number;
  };
  category: string[];
};
const HomePage = () => {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [dataBook, setDataBook] = useState<IBooks[]>([]);
  const [dataCategory, setDataCategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSizeState, setPageSizeState] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("&sort=-sold");
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setDataCategory(d);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    fetchBook();
  }, [currentPage, pageSizeState, sortQuery, filter]);
  const fetchBook = async () => {
    setIsLoading(true);
    let query = `?current=${currentPage}&pageSize=${pageSizeState}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await getBookAPI(query);
    if (res && res.data) {
      setDataBook(res.data.result);
      setTotalPage(res.data.meta.total);
    } else {
      setDataBook([]); // tránh lỗi .map()
      message.error(res.message);
    }
    setIsLoading(false);
  };
  //page
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = async (
    current,
    pageSize
  ) => {
    if (current !== currentPage) {
      setCurrentPage(current);
    }
    if (pageSize !== pageSizeState) {
      setPageSizeState(pageSize);
    }
  };
  //select box / filter
  // const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
  //   checkedValues
  // ) => {
  //   // Nếu có ít nhất 1 checkbox được chọn
  //   if (checkedValues.length > 0) {
  //     // Convert mảng ['History', 'Sports'] => 'category=History,Sports'
  //     const queryString = `&category=${checkedValues.join(",")}`;
  //     setFilter(queryString);
  //   } else {
  //     // Nếu bỏ chọn hết, reset filter
  //     setFilter("");
  //   }
  // };
  const onChangeTab = (key: string) => {
    console.log(key);
    if (key === "sold") {
      setSortQuery("sort=-sold");
    }
    if (key === "createdAt") {
      setSortQuery("sort=-createdAt");
    }
    if (key === "price") {
      setSortQuery("sort=price");
    }
    if (key === "-price") {
      setSortQuery("sort=-price");
    }
  };
  const handleChangeFilter = (changedValues: any, values: any) => {
    //only fire if category change
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };
  // Price
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values.range.from}&price<=${values.range.to}`;
      if (values?.category?.length) {
        const cate = values.category.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };
  return (
    <Layout className="bookstore-layout">
      {/* CONTENT */}
      <Content className="main-content">
        {/* SIDEBAR */}
        <div className="sidebar">
          <h4>Bộ lọc tìm kiếm</h4>
          <Divider />
          <div>Danh Mục Sản Phẩm </div>
          <Form
            form={form}
            onFinish={onFinish}
            layout="inline"
            onValuesChange={(changedValues: any, values: any) => {
              handleChangeFilter(changedValues, values);
            }}
          >
            <Form.Item<FieldType> name={"category"}>
              <Checkbox.Group
                style={{ display: "flex", flexDirection: "column" }}
              >
                {dataCategory.map((item) => (
                  <Checkbox
                    key={item.label}
                    value={item.value}
                    style={{ marginTop: 8 }}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>

            <Divider />
            <div>Khoảng giá</div>

            <div className="price-filter">
              <Form.Item<FieldType>
                name={["range", "from"]}
                rules={[
                  { required: true, message: "Please input this price!" },
                ]}
              >
                <InputNumber
                  name="from"
                  placeholder="TỪ"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item<FieldType>
                name={["range", "to"]}
                rules={[
                  { required: true, message: "Please input this price!" },
                ]}
              >
                <InputNumber
                  name="to"
                  placeholder="ĐẾN"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </div>

            <Button
              type="primary"
              block
              style={{ marginTop: 16 }}
              onClick={() => {
                form.submit();
              }}
            >
              Áp dụng
            </Button>
          </Form>
        </div>

        {/* BOOK LIST */}
        <div className="book-list">
          <Tabs
            defaultActiveKey="sold"
            onChange={onChangeTab}
            items={[
              { key: "sold", label: "Phổ biến" },
              { key: "createdAt", label: "Hàng mới" },
              { key: "price", label: "Giá Thấp Đến Cao" },
              { key: "-price", label: "Giá Cao Đến Thấp" },
            ]}
          />

          <Spin tip="Loading" size="large" spinning={isLoading}>
            <Row gutter={[24, 24]}>
              {dataBook.map((b, idx) => (
                <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Card
                    onClick={() => {
                      navigate(`/book/${b._id}`);
                    }}
                    hoverable
                    className="book-card"
                    cover={
                      <img
                        alt={b.mainText}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          b.thumbnail
                        }`}
                        className="book-image"
                      />
                    }
                  >
                    <div className="book-title">{b.mainText}</div>
                    <div className="book-price">
                      {b.price.toLocaleString()} đ
                    </div>
                    <Rate disabled defaultValue={5} style={{ fontSize: 12 }} />
                    <div className="book-sold">Đã bán {b.sold}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>

          <div className="pagination-container">
            <Pagination
              showSizeChanger
              //onShowSizeChange={onShowSizeChange}
              defaultCurrent={1}
              total={totalPage}
              onChange={onShowSizeChange}
              pageSizeOptions={[5, 10, 15, 20]}
              defaultPageSize={5}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};
export default HomePage;
