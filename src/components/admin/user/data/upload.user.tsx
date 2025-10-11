import { Button, Modal, message, Upload, Space, Table, Tag } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Buffer } from "buffer";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  //action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  accept:
    ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  customRequest({ file, onSuccess }) {
    setTimeout(() => {
      if (onSuccess) {
        onSuccess("ok");
      }
    }, 1000);
  },
  async onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log("i", info.file, info.fileList);
    }
    if (status === "done") {
      // const file: any = info.file.originFileObj;
      // const arrayBuffer = await file.arrayBuffer();
      // const buffer = Buffer.from(arrayBuffer);
      // console.log("b", buffer);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};
const columns: TableProps<DataType>["columns"] = [
  {
    title: "Họ và tên",
    dataIndex: "fullName",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "age",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "address",
  },
];
type IProps = {
  openModalImport: boolean;
  setOpenModalImport: (v: boolean) => void;
};
interface DataType {
  fullName: string;
  email: string;
  phone: number;
}
const ImportUser = ({ openModalImport, setOpenModalImport }: IProps) => {
  return (
    <Modal
      title="Upload user"
      closable={{ "aria-label": "Custom Close Button" }}
      open={openModalImport}
      onOk={() => setOpenModalImport(false)}
      onCancel={() => setOpenModalImport(false)}
      width={"40%"}
      okButtonProps={{ disabled: true }}
    >
      <>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. Only accept .csv .xls .xlsx .
          </p>
        </Dragger>
        <Table<DataType> columns={columns} />;
      </>
    </Modal>
  );
};
export default ImportUser;
