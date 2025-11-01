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
import type { PaginationProps } from "antd";
import { Flex, Spin } from "antd";

import { getBookAPI, getCategoryAPI } from "@/services/api";

const { Content } = Layout;

const HomePage = () => {
  const [dataBook, setDataBook] = useState<IBooks[]>([]);
  const [dataCategory, setDataCategory] = useState<string[]>([]);
  const [totalPage, setTotalPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        setDataCategory(res.data);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    let query = "";
    const fetchBook = async () => {
      query += `?current=1&pageSize=5`;
      const res = await getBookAPI(query);
      if (res && res.data) {
        setDataBook(res.data.result);
        setTotalPage(res.data.meta.total);
      } else {
        message.error(res.message);
      }
    };
    fetchBook();
  }, []);
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = async (
    current,
    pageSize
  ) => {
    setIsLoading(true);
    let query = `?current=${current}&pageSize=${pageSize}`;
    const res = await getBookAPI(query);
    if (res && res.data) {
      setDataBook(res.data.result);
    } else {
      message.error(res.message);
    }
    setIsLoading(false);
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
          <Checkbox.Group style={{ display: "flex", flexDirection: "column" }}>
            {dataCategory.map((item) => (
              <Checkbox key={item} value={item} style={{ marginTop: 8 }}>
                {item}
              </Checkbox>
            ))}
          </Checkbox.Group>
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
            <Flex align="center" gap="middle">
              <Spin size="large" />
            </Flex>
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
