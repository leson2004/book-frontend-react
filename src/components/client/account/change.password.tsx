import { useEffect } from "react";

import { Button, Checkbox, Form, Input, FormProps, App } from "antd";
import { useCurrentApp } from "@/components/context/app.context";
import { updateUserPasswordAPI } from "@/services/api";

type FieldType = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

const ChangPassword = () => {
  const { user } = useCurrentApp();
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  console.log("user change", user);
  useEffect(() => {
    console.log("useEffect run", user);
    if (user) {
      form.setFieldsValue({
        email: user.email,
      });
    }
  }, [user]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, oldPassword, newPassword } = values;
    const res = await updateUserPasswordAPI(email, oldPassword, newPassword);
    if (res && res.data) {
      message.success("Cập nhật thông tin user thành công");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true }]}
        >
          <Input disabled={true} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu hiện tại"
          name="oldPassword"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu mới "
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangPassword;
