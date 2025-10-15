import { Button, Modal, message, Upload, Space, Table, Tag, App } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Buffer } from "buffer";
import { useState } from "react";
import Exceljs from "exceljs";
import templateFile from "assets/template/DataUsers.xlsx?url";

import { createNewUserBulk } from "@/services/api";

const { Dragger } = Upload;
type IProps = {
  openModalImport: boolean;
  setOpenModalImport: (v: boolean) => void;
  refreshTable: () => void;
};
interface DataType {
  fullName: string;
  email: string;
  phone: string;
}
interface IDataImport {
  fullName: string;
  email: string;
  phone: string;
}
const ImportUser = (prop: IProps) => {
  const { openModalImport, setOpenModalImport, refreshTable } = prop;
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const createUserBulk = async () => {
    const dataUser = dataImport.map((item) => {
      return {
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
      };
    });
    setIsSubmit(true);
    const res = await createNewUserBulk(dataUser);
    if (res) {
      message.success(`success: ${res.data?.countSuccess}
        error : ${res.data?.countError}
        `);
    }
    setIsSubmit(false);
    setDataImport([]);
    setOpenModalImport(false);
    refreshTable();
  };
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
        console.log("info", info);
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj!;
          //load file to buffer
          const workbook = new Exceljs.Workbook();
          const arrayBuffer = await file.arrayBuffer();
          // use readFile for testing purpose
          await workbook.xlsx.load(arrayBuffer);
          // covert file to json
          let jsonData: IDataImport[] = [];
          workbook.worksheets.forEach(function (sheet: any) {
            // read first row as data keys
            let firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;
            let keys = firstRow.values as any[];
            sheet.eachRow((row: any, rowNumber: any) => {
              if (rowNumber == 1) return;
              let values = row.values as any;
              let obj: any = {};
              for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = values[i];
              }
              jsonData.push(obj);
            });
            jsonData = jsonData.map((item, index) => {
              return { ...item, idex: index + 1 };
            });
            setDataImport(jsonData);
            console.log("son", jsonData);
          });
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <Modal
        title="Upload user"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalImport}
        onOk={() => {
          createUserBulk();
        }}
        onCancel={() => {
          setOpenModalImport(false);
          setDataImport([]);
        }}
        width={"40%"}
        okButtonProps={{
          disabled: dataImport.length > 0 ? false : true,
          loading: isSubmit,
        }}
        // do not close when click outside
        maskClosable={false}
        destroyOnClose={false}
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
              Support for a single upload. Only accept .csv .xls .xlsx .or
              &nbsp;
              <a
                onClick={(e) => e.stopPropagation()} // để ngăn chặn nổi bọt khi click vào thẻ a mà ăn vào thẻ cha
                href={templateFile}
                download
              >
                download sample file
              </a>
            </p>
          </Dragger>
          <Table<DataType>
            rowKey={"id"}
            dataSource={dataImport}
            columns={[
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
            ]}
          />
          ;
        </>
      </Modal>
      ;
    </>
  );
};
export default ImportUser;
