import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Badge,
  Avatar,
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
} from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import "@/styles/home.scss";
import type {
  PaginationProps,
  CheckboxOptionType,
  GetProp,
  FormProps,
} from "antd";
import { Flex, Spin } from "antd";

import { getBookAPI, getCategoryAPI } from "@/services/api";
import { Form } from "antd/lib";

const { Content } = Layout;

const HomePage = () => {
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
      query += filter;
    }
    if (sortQuery) {
      query += sortQuery;
    }
    const res = await getBookAPI(query);
    if (res && res.data) {
      setDataBook(res.data.result);
      setTotalPage(res.data.meta.total);
    } else {
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
  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    // Nếu có ít nhất 1 checkbox được chọn
    if (checkedValues.length > 0) {
      // Convert mảng ['History', 'Sports'] => 'category=History,Sports'
      const queryString = `&category=${checkedValues.join(",")}`;
      setFilter(queryString);
    } else {
      // Nếu bỏ chọn hết, reset filter
      setFilter("");
    }
  };
  const onChangeTab = (key: string) => {
    console.log(key);
    if (key === "sold") {
      setSortQuery("&sort=-sold");
    }
    if (key === "createdAt") {
      setSortQuery("&sort=-createdAt");
    }
    if (key === "price") {
      setSortQuery("&sort=price");
    }
    if (key === "-price") {
      setSortQuery("&sort=-price");
    }
  };
  // Price
  const onFinish: FormProps<any>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  return (
    <Layout className="bookstore-layout">
      {/* CONTENT */}
      <Content className="main-content">
        {/* SIDEBAR */}
        <div className="sidebar">
          <h4>Bộ lọc tìm kiếm</h4>
          <Divider />
          <div>Danh mục sản phẩm</div>
          <Checkbox.Group
            style={{ display: "flex", flexDirection: "column" }}
            onChange={onChange}
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

          <Divider />
          <div>Khoảng giá</div>
          <Form layout="inline" onFinish={onFinish}>
            <div className="price-filter">
              <Form.Item<any>
                name="fromPrice"
                rules={[
                  { required: true, message: "Please input this price!" },
                ]}
              >
                <InputNumber placeholder="TỪ" min={0} />
              </Form.Item>
              <Form.Item<any>
                name="toPrice"
                rules={[
                  { required: true, message: "Please input this price!" },
                ]}
              >
                <InputNumber placeholder="ĐẾN" min={0} />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ marginTop: 16 }}
              >
                Áp dụng
              </Button>
            </Form.Item>
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

          {isLoading ? (
            <Spin tip="Loading" size="large" spinning={isLoading}>
              <Row gutter={[24, 24]}>
                {dataBook.map((b, idx) => (
                  <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={4}>
                    <Card
                      hoverable
                      className="book-card"
                      cover={
                        <img
                          alt={b.mainText}
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${b.thumbnail}`}
                          className="book-image"
                        />
                      }
                    >
                      <div className="book-title">{b.mainText}</div>
                      <div className="book-price">
                        {b.price.toLocaleString()} đ
                      </div>
                      <Rate
                        disabled
                        defaultValue={5}
                        style={{ fontSize: 12 }}
                      />
                      <div className="book-sold">Đã bán {b.sold}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Spin>
          ) : (
            <Row gutter={[24, 24]}>
              {dataBook.map((b, idx) => (
                <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Card
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
          )}
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
