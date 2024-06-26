import React, { useState, useEffect } from "react";
import {
  Modal,
  Col,
  Row,
  Form,
  Input,
  Select,
  Upload,
  InputNumber,
  notification,
  message,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  callCategory,
  callCreateBook,
  callUploadBookImg,
} from "../../../services/UserServices";

const ModalCreateBook = (props) => {
  const [form] = Form.useForm();

  const { showModalCreateBook, setShowModalCreateBook } = props;

  const [loading, setLoading] = useState(false);
  const [loadingSlier, setLoadingSlider] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [listCategory, setListCategory] = useState([]);

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const onFinish = async (values) => {
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh thumbnail",
      });
      return;
    }
    if (dataSlider.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh Slider",
      });
      return;
    }
    const { mainText, author, price, sold, quantity, category } = values;
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    const res = await callCreateBook(
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category
    );
    if (res && res.data) {
      message.success("Thêm mới book thành công!!");
      form.setFields();
      setDataSlider([]);
      setDataThumbnail([]);
      setShowModalCreateBook(false);
      await props.fetchListBook();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!!",
        description: res.message,
      });
    }
  };
  //call category
  useEffect(() => {
    const fetchCategoty = async () => {
      const res = await callCategory();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setListCategory(d);
      }
    };
    fetchCategoty();
  }, []);
  // Upload images
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(false) : setLoading(false);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra!!!");
    }
  };
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra!!!");
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const handlePreview = async (file) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  return (
    <>
      <Modal
        width={"40vw"}
        title="Thêm mới sách"
        open={showModalCreateBook}
        onCancel={() => {
          setShowModalCreateBook(false);
          form.resetFields();
        }}
        okText="Thêm mới sách"
        cancelText="Hủy"
        onOk={() => form.submit()}
      >
        <Form name="basic" autoComplete="off" form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Tên sách"
                    name="mainText"
                    rules={[
                      { required: true, message: "Không được để trống !!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Giá tiền"
                    name="price"
                    rules={[
                      { required: true, message: "Không được để trống !!" },
                    ]}
                  >
                    <InputNumber
                      addonAfter="VNĐ"
                      min={1}
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Thể loại"
                    name="category"
                    rules={[
                      { required: true, message: "Không được để trống !!" },
                    ]}
                  >
                    <Select
                      //defaultValue="null"
                      showSearch
                      allowClear
                      //onChange={handleChange}
                      style={{ width: "100%" }}
                      options={listCategory}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Ảnh Thumbnail"
                    name="thumbnail"
                  >
                    <Upload
                      name="thumbnail"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileThumbnail}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                      onPreview={handlePreview}
                    >
                      <div
                        style={{ border: 0, background: "none" }}
                        type="button"
                      >
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Tác giả"
                    name="author"
                    rules={[
                      { required: true, message: "Không được để trống !!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Số lượng"
                    name="quantity"
                    rules={[
                      { required: true, message: "Không được để trống !!" },
                    ]}
                  >
                    <InputNumber type="number" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Đã bán"
                    name="sold"
                    rules={[
                      { required: true, message: "Không được để trống !!" },
                    ]}
                    initialValue={0}
                  >
                    <InputNumber
                      type="number"
                      style={{ width: "100%" }}
                      defaultValue={0}
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Ảnh Slider"
                    name="slider"
                  >
                    <Upload
                      multiple={true}
                      name="slider"
                      listType="picture-card"
                      className="avatar-uploader"
                      customRequest={handleUploadFileSlider}
                      beforeUpload={beforeUpload}
                      onChange={(info) => handleChange(info, "slider")}
                      onRemove={(file) => handleRemoveFile(file, "slider")}
                      onPreview={handlePreview}
                    >
                      <div
                        style={{ border: 0, background: "none" }}
                        type="button"
                      >
                        {loadingSlier ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ModalCreateBook;
