import React, { useState } from "react";
import { Modal, Upload, Table, message, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../../utils/UserServices";
import templateFile from './template.xlsx?url'

const { Dragger } = Upload;

const UploadUser = (props) => {
  const { showUploadModal, setShowUploadModal } = props;
  const [dataExcel, setDataExcel] = useState([]);

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const render = new FileReader();
          render.readAsArrayBuffer(file);
          render.onload = function (e) {
            const data = new Uint8Array(render.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1,
            });
            if (json && json.length > 0) {
              setDataExcel(json);
            }
          };
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const renderTitle = () => {
    return (
      <div>
        <p>Dữ liệu upload:</p>
      </div>
    );
  };

  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });

    const res = await callBulkCreateUser(data);
    if (res.data) {
      notification.success({
        description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
        message: "Upload file thành công",
      });
      setDataExcel([]);
      setShowUploadModal(false);
      await props.fetchUserList();
    } else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi xảy ra",
      });
    }
  };
  return (
    <>
      <Modal
        title="Import data user"
        width={"50vw"}
        open={showUploadModal}
        onCancel={() => {
          setShowUploadModal(false);
          setDataExcel([]);
        }}
        onOk={() => handleSubmit()}
        okText="Import data"
        cancelText="Cancel"
        okButtonProps={{
          disabled: dataExcel.length < 1,
        }}
        //do not close when click outside
        maskClosable={false}
      >
        <Dragger {...UploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Only accept .csv, .xls, .xlsx
            or <a onClick={(e) => e.stopPropagation()} href={templateFile} download>Download Sample File</a>
          </p>
        </Dragger>
        <Table
          title={renderTitle}
          dataSource={dataExcel}
          rowKey="name"
          columns={[
            {
              title: "Name",
              dataIndex: "fullName",
            },
            {
              title: "Email",
              dataIndex: "email",
            },
            {
              title: "Số điện thoại",
              dataIndex: "phone",
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default UploadUser;
