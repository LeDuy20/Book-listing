import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, notification } from "antd";
import { callDeteleUser, fetchUser } from "../../../services/UserServices";
import { MdDeleteOutline } from "react-icons/md";
import { PiExport } from "react-icons/pi";
import { BiImport } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoReload } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import InputSearch from "./InputSearch";
import UserViewDetail from "./UserViewDetail";
import ModalCreateNewUser from "./ModalCreateNewUser";
import UploadUser from "./data/ImportUser";
import moment from "moment";
import * as XLSX from "xlsx";
import UpdateUser from "./UpdateUser";

const UserTable = () => {
  const style = { display: "flex", alignItems: "center" };
  const style1 = { width: "16px", height: "16px", marginRight: "7px" };
  // Table User
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("");

  //Sort
  const [sortQuery, setSortQuery] = useState("");

  //Detail user
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState("");

  //Show modal create new user
  const [openModalCreateNewUser, setOpenModalCreateNewUser] = useState(false);
  //Upload user
  const [showUploadModal, setShowUploadModal] = useState(false);

  // show modal update user
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState("");

  useEffect(() => {
    fetchUserList();
  }, [current, pageSize, filter, sortQuery]);

  // Fetch user
  const fetchUserList = async () => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await fetchUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };

  //handle delete user
  const handleDeleteUser = async (userId) => {
    const res = await callDeteleUser(userId);
    if (res && res.data) {
      message.success("Xóa user thành công !!");
      fetchUserList();
    } else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi xảy ra!!",
      });
    }
  };
  //columns
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true);
              setDataViewDetail(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Ngày cập nhập",
      dataIndex: "createdAt",
      sorter: true,
      render: (text, record, index) => {
        return <p>{moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>;
      },
    },
    {
      title: "Actions",
      render: (text, record, index) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <>
              <Popconfirm
                placement="rightTop"
                trigger="click"
                title="Xác nhận xóa user"
                description="Bạn có chắc muốn xóa user này ?"
                okText="Xác nhận"
                okCancel="Hủy"
                onConfirm={() => handleDeleteUser(record._id)}
              >
                <MdDeleteOutline
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "#fd4343",
                    cursor: "pointer",
                  }}
                />
              </Popconfirm>
            </>
            <FaPencilAlt
              style={{
                width: "16px",
                height: "16px",
                color: "#faad14",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowModalUpdate(true);
                setDataUpdate(record);
              }}
            />
          </div>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  //handle search
  const handleSearch = (query) => {
    setCurrent(1);
    setFilter(query);
  };
  // title table
  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Table list users :</h4>
        <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          <Button
            type="primary"
            style={style}
            icon={<BiImport style={style1} />}
            onClick={() => setShowUploadModal(true)}
          >
            Import
          </Button>
          <Button
            type="primary"
            style={style}
            icon={<PiExport style={style1} />}
            onClick={() => handleExportData()}
          >
            Export
          </Button>
          <Button
            type="primary"
            style={style}
            onClick={() => setOpenModalCreateNewUser(true)}
            icon={<FaPlus style={style1} />}
          >
            Create new
          </Button>
          <Button
            style={{ border: "none" }}
            onClick={() => {
              setFilter("");
              setSortQuery("");
            }}
          >
            <IoReload />
          </Button>
        </div>
      </div>
    );
  };
  // handle export data
  const handleExportData = () => {
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportUser.csv");
    }
  };
  return (
    <>
      <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
      <div style={{ background: "#fff", borderRadius: "10px" }}>
        <Table
          title={renderHeader}
          style={{ padding: "20px 0" }}
          columns={columns}
          dataSource={listUser}
          onChange={onChange}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            total: total,
          }}
        />
        <UserViewDetail
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
          dataViewDetail={dataViewDetail}
          setDataViewDetail={setDataViewDetail}
        />
        <ModalCreateNewUser
          openModalCreateNewUser={openModalCreateNewUser}
          setOpenModalCreateNewUser={setOpenModalCreateNewUser}
          fetchUserList={fetchUserList}
        />
        <UploadUser
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
        />
        <UpdateUser
          showModalUpdate={showModalUpdate}
          setShowModalUpdate={setShowModalUpdate}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
          fetchUserList={fetchUserList}
        />
      </div>
    </>
  );
};

export default UserTable;
