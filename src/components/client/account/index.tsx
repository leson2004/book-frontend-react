import { useState } from "react";

import { Button, Modal, Tabs } from "antd";
import type { TabsProps } from "antd";
import UserInfo from "./user.info";
import ChangePassword from "./change.password";
interface IProps {
  isModalOpenManageAccount: boolean;
  setIsModalOpenManageAccount: (v: boolean) => void;
}
const AccountManage = (props: IProps) => {
  const { isModalOpenManageAccount, setIsModalOpenManageAccount } = props;
  const showModal = () => {
    setIsModalOpenManageAccount(true);
  };

  const handleOk = () => {
    setIsModalOpenManageAccount(false);
  };

  const handleCancel = () => {
    setIsModalOpenManageAccount(false);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: <UserInfo />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <ChangePassword />,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpenManageAccount}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </>
  );
};

export default AccountManage;
