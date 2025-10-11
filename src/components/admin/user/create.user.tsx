import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { message } from "antd";
import type { FormProps } from "antd";

import { useNavigate } from "react-router-dom";
import { createNewUser } from "@/services/api";

type IProps = {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
};
type FieldType = {
  fullName: string;
  password: string;
  phone: string;
  email: string;
};

const CreateNewUser = ({
  openModalCreate,
  setOpenModalCreate,
  refreshTable,
}: IProps) => {
  const [form] = Form.useForm();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("value", values);
    const { fullName, email, password, phone } = values;
    const res = await createNewUser(fullName, email, password, phone);
    console.log("resa", res);
    if (res.data?.email) {
      message.success("Tạo mới người dùng thành công ");
      refreshTable(); // refresh table user được truyền từ table user và nhận qua props
      form.resetFields(); // refresh,xóa giá trị input
    } else {
      message.error("có lỗi xảy ra");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  // const closeModal = () => {
  //   setOpenModalCreate(false);
  // };

  return (
    <>
      <Modal
        title="Thêm mới người dùng "
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalCreate}
        onOk={() => {
          form.submit(); // đây là cách thao tác với form (antd) khi khai báo  Form.useForm();
        }}
        onCancel={() => {
          form.resetFields();
          setOpenModalCreate(false);
        }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: "100%" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="username"
            name="fullName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType>
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateNewUser;
