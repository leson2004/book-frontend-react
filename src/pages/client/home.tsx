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
import type { PaginationProps, CheckboxOptionType, GetProp } from "antd";
import { Flex, Spin } from "antd";

import { getBookAPI, getCategoryAPI } from "@/services/api";

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
  }, [currentPage, pageSizeState]);
  const fetchBook = async () => {
    setIsLoading(true);
    let query = `?current=${currentPage}&pageSize=${pageSizeState}`;
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
  //select box
  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
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
            options={dataCategory}
            defaultValue={["Pear"]}
            onChange={onChange}
            // style={{ display: "block", marginRight: 0 }}
          />

          <Divider />
          <div>Khoảng giá</div>
          <div className="price-filter">
            <InputNumber placeholder="TỪ" min={0} />
            <InputNumber placeholder="ĐẾN" min={0} />
          </div>
          <Button type="primary" block style={{ marginTop: 16 }}>
            Áp dụng
          </Button>
        </div>

        {/* BOOK LIST */}
        <div className="book-list">
          <Tabs
            defaultActiveKey="1"
            items={[
              { key: "1", label: "Phổ biến" },
              { key: "2", label: "Hàng mới" },
              { key: "3", label: "Giá Thấp Đến Cao" },
              { key: "4", label: "Giá Cao Đến Thấp" },
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
