import React, { useState, useEffect } from "react";
import { Drawer, Descriptions, Modal, Upload } from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const BookViewDetail = (props) => {
  const {
    setDataViewDetail,
    dataViewDetail,
    setShowViewDetail,
    showViewDetail,
  } = props;

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const onCLose = () => {
    setShowViewDetail(false);
    setDataViewDetail(null);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    if (dataViewDetail) {
      let imgThumbnail = {},  imgSlider = [];
      
      if (dataViewDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          nam: dataViewDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataViewDetail.thumbnail
          }`,
        };
      }
      if(dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        dataViewDetail.slider.map((item) => {
            imgSlider.push({
              uid: uuidv4,
              name: item,
              status: 'done',
              url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
        })})
      }

      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataViewDetail]);
  return (
    <Drawer
      title="Xem chi tiết "
      onClose={onCLose}
      open={showViewDetail}
      width="50vw"
    >
      <Descriptions title="Thông tin book" column={2} bordered>
        <Descriptions.Item label="id">{dataViewDetail?._id}</Descriptions.Item>
        <Descriptions.Item label="Tên sách">
          {dataViewDetail?.mainText}
        </Descriptions.Item>
        <Descriptions.Item label="Tác giả">
          {dataViewDetail?.author}
        </Descriptions.Item>
        <Descriptions.Item label="Giá">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(dataViewDetail?.price ?? 0)}
        </Descriptions.Item>
        <Descriptions.Item label="Thể loại">
          {dataViewDetail?.category}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng còn trong kho">
          {dataViewDetail?.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {moment(dataViewDetail?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
        </Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 20 }}>
        <h3>Ảnh Books : </h3>
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%"}} src={previewImage} />
        </Modal>
      </div>
    </Drawer>
  );
};

export default BookViewDetail;
