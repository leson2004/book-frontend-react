import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Divider,
  Col,
  Row,
  InputNumber,
  Select,
  Upload,
} from "antd";
import type { FormProps } from "antd";
import { getCategoryAPI } from "@/services/api";
import { App } from "antd";

import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

import type { GetProp, UploadProps, UploadFile } from "antd";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadChangeParam } from "antd/es/upload";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type IProps = {
  openModalAddBook: boolean;
  setOpenModalAddBook: (v: boolean) => void;
};
type FieldType = {
  mainText: string;
  author: string;
  price: number;
  category: string;
  quantity: number;
  thumbnail: any;
  slider: any;
};

const CreateBook = (props: IProps) => {
  const { openModalAddBook, setOpenModalAddBook } = props;
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [preViewImage, setPreviewImage] = useState<string>("");
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    console.log(values);
    setIsSubmit(false);
  };
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  // điều kiện upload img
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return isJpgOrPng && isLt2M;
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleChange = (
    info: UploadChangeParam,
    type: "thumbnail" | "slider"
  ) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
      return;
    }
  };
  const handleUploadFile: UploadProps["customRequest"] = ({
    onSuccess,
    onError,
    file,
  }) => {
    setTimeout(() => {
      if (onSuccess) onSuccess("ok");
      else if (onError) onError(new Error("Upload failed"));
    }, 1000);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };
  return (
    <>
      <Modal
        title="Thêm mới book"
        open={openModalAddBook}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields();
          setOpenModalAddBook(false);
        }}
        okButtonProps={{ loading: isSubmit }}
        okText="Tạo mới"
        cancelText="Huỷ"
        confirmLoading={isSubmit}
        destroyOnClose
        width="55vw"
        maskClosable={false}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: "100%" }}
          initialValues={{ remember: true }}
          //   onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            {/* Tên sách */}
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Tên sách"
                name="mainText"
                rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
              >
                <Input placeholder="Nhập tên sách" />
              </Form.Item>
            </Col>

            {/* Tác giả */}
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Tác giả"
                name="author"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tác giả!" },
                ]}
              >
                <Input placeholder="Nhập tên tác giả" />
              </Form.Item>
            </Col>
            {/* Giá tiền */}
            <Col span={6}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonAfter="đ"
                />
              </Form.Item>
            </Col>
            {/* Cột 2 - Thể loại */}
            <Col span={6}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
              >
                <Select
                  showSearch
                  allowClear
                  options={listCategory}
                  placeholder="Chọn thể loại"
                />
              </Form.Item>
            </Col>
            {/* Số lượng */}
            <Col span={6}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Ảnh Thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập upload thumbnail!",
                  },
                ]}
                // convert value from Upload => form
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFile}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "thumbnail")}
                  onPreview={handlePreview}
                >
                  {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
                rules={[
                  { required: true, message: "Vui lòng nhập upload slider!" },
                ]}
                // convert value from Upload => form
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  multiple
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFile}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onPreview={handlePreview}
                >
                  {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default CreateBook;
