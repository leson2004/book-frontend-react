import { Drawer, Descriptions, Avatar, Divider } from "antd";
import dayjs from "dayjs";
//import type { DescriptionsProps } from 'antd';
//import { useState } from 'react';
import { FORMATE_DATE } from "@/services/helper";
import { Image, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
type IProps = {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IBooks | null;
  setDataViewDetail: (v: IBooks | null) => void;
};

const ViewDetailBook = ({
  openViewDetail,
  setOpenViewDetail,
  dataViewDetail,
  setDataViewDetail,
}: IProps) => {
  //   const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
  //     dataViewDetail?.avatar
  //   }`;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };
  // để hiển thị ảnh cả ảnh chính và phụ , thì sử dụng useEffect , ban đầu tạo 1 mảng rỗng , dùng điều kiện và push giá trị vào mảng mới và dùng rest ... để copy
  useEffect(() => {
    let arrImg = [];
    if (dataViewDetail?.thumbnail) {
      arrImg.push({
        uid: uuidv4(),
        name: dataViewDetail.mainText,
        //status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataViewDetail?.thumbnail
        }`,
      });
    }
    if (dataViewDetail?.slider && dataViewDetail?.slider.length > 0) {
      const slide = dataViewDetail?.slider.map((item) => {
        return {
          uid: uuidv4(),
          name: dataViewDetail.mainText,
          //status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });
      arrImg.push(...slide);
    }
    setFileList(arrImg);
  }, [dataViewDetail]);
  return (
    <>
      <Drawer
        title="Basic Drawer"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={openViewDetail}
        width={"50vw"}
      >
        <Descriptions bordered title="Thông tin chi tiết người dùng ">
          <Descriptions.Item label="ID" span={2}>
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên sách " span={2}>
            {dataViewDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả " span={2}>
            {dataViewDetail?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền  " span={2}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(dataViewDetail?.price ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={3}>
            {dataViewDetail?.category}
          </Descriptions.Item>
          <Descriptions.Item label="CreateAt " span={2}>
            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE)}
          </Descriptions.Item>
          <Descriptions.Item label="UpdateAt" span={2}>
            {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE)}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Ảnh Book</Divider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Drawer>
    </>
  );
};
export default ViewDetailBook;
