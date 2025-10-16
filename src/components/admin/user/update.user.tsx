import { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import { message } from "antd";
import type { FormProps } from "antd";
import { createNewUser, updateUser } from "@/services/api";

type IProps = {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdateUser: IUserTable | null;
  setDataUpdateUser: (v: IUserTable | null) => void;
};
type FieldType = {
  fullName: string;
  phone: string;
};

const UpdateUser = ({
  openModalUpdate,
  setOpenModalUpdate,
  dataUpdateUser,
  setDataUpdateUser,
  refreshTable,
}: IProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      email: `${dataUpdateUser?.email}`,
      fullName: `${dataUpdateUser?.fullName}`,
      phone: `${dataUpdateUser?.phone}`,
    });
  }, [dataUpdateUser]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    //console.log("value", values);
    const { fullName, phone } = values;
    const _id: string | undefined = dataUpdateUser?._id;
    const res = await updateUser(_id, fullName, phone);
    if (res && res.data) {
      message.success("Cập nhật người dùng thành công ");
      setDataUpdateUser(null);
      refreshTable();
      setOpenModalUpdate(false);
    } else {
      message.error(res.message);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="Cập nhật thông tin người dùng "
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          form.resetFields();
          setOpenModalUpdate(false);
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
          <Form.Item name="email" label="E-mail">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<FieldType>
            label="username"
            name="fullName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
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

export default UpdateUser;
