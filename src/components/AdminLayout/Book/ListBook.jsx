import React, { useState, useEffect } from "react";
import { Table, Button,Popconfirm, message, notification } from "antd";
import { MdOutlineDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { PiExport } from "react-icons/pi";
import { IoReload } from "react-icons/io5";
import { callDeleteBook, fetchBook } from "../../../utils/UserServices";
import SearchBook from "./SearchBook";
import moment from "moment";
import BookViewDetail from "./BookViewDetail";
import ModalCreateBook from "./ModalCreateBook";
import UpdateBook from "./UpdateBook";
const ListBook = () => {
  const style = { display: "flex", gap: 5, alignItems: "center" };
  //table book
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  //filter
  const [filter, setFilter] = useState("");
  //sort
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  // Show view detail
  const [showViewDetail, setShowViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState("");

  //Show modal create book
  const [showModalCreateBook, setShowModalCreateBook] = useState(false);

  //show modal update book
  const [showModalUpdateBook, setShowModalUpdateBook] = useState(false);
  const [dataUpdateBook, setDataUpdateBook] = useState("");

  // handle delete book
  const handleDeleteBook = async (bookId) => {
    const res = await callDeleteBook(bookId)
    if(res && res.data) {
      message.success('Xóa book thành công !!!')
      fetchListBook()
    } else {
      notification.error({
        description: res.message,
        message:  'Đã có lỗi xảy ra!!'
      })
    }
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              setShowViewDetail(true);
              setDataViewDetail(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      render: (text, record, index) => {
        return (
          <p>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(record.price)}
          </p>
        );
      },
      sorter: true,
    },
    {
      title: "Ngày cập nhập",
      dataIndex: "createdAt",
      render: (text, record, index) => {
        return <p>{moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>;
      },
      sorter: true,
    },
    {
      title: "Actions",
      render: (text, record, index) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Popconfirm 
              placement="rightTop"
              trigger="click"
              title='Xác nhận xóa user'
              description='Bạn có chắc muốn xóa user này ?'
              okText='Xác nhận'
              okCancel='Hủy'
              onConfirm = {() =>handleDeleteBook(record._id)}
              >
                <MdOutlineDelete
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "#fd4343",
                    cursor: "pointer",
                  }}
                />
              </Popconfirm>
            <FaPencilAlt
              style={{
                width: "16px",
                height: "16px",
                color: "#faad14",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowModalUpdateBook(true);
                setDataUpdateBook(record);
              }}
            />
          </div>
        );
      },
    },
  ];
  // fetch list book
  useEffect(() => {
    fetchListBook();
  }, [current, pageSize, filter, sortQuery]);

  const fetchListBook = async () => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await fetchBook(query);
    if (res && res.data && res.data.result) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };
  //handle change
  const onChange = (pagination, filters, sorter, extra) => {
    //console.log("params", pagination, filters, sorter, extra);
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    if (sorter && sorter.field) {
      let q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  //handle search
  const handleSearch = (query) => {
    setFilter(query);
  };
  //title table
  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>Table List Book: </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Button style={style} type="primary">
            <PiExport />
            Export
          </Button>
          <Button
            style={style}
            type="primary"
            onClick={() => {
              setShowModalCreateBook(true);
            }}
          >
            <FaPlus />
            Thêm mới
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
  return (
    <>
      <SearchBook handleSearch={handleSearch} setFilter={setFilter} />
      <Table
        style={{ padding: "20px 0" }}
        title={renderHeader}
        columns={columns}
        dataSource={listBook}
        onChange={onChange}
        rowKey="_id"
        loading={setLoading}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
        }}
      />
      <BookViewDetail
        setDataViewDetail={setDataViewDetail}
        dataViewDetail={dataViewDetail}
        setShowViewDetail={setShowViewDetail}
        showViewDetail={showViewDetail}
      />
      <ModalCreateBook
        showModalCreateBook={showModalCreateBook}
        setShowModalCreateBook={setShowModalCreateBook}
        fetchListBook={fetchListBook}
      />
      <UpdateBook
        showModalUpdateBook={showModalUpdateBook}
        setShowModalUpdateBook={setShowModalUpdateBook}
        setDataUpdateBook={setDataUpdateBook}
        dataUpdateBook={dataUpdateBook}
        fetchListBook={fetchListBook}
      />
    </>
  );
};

export default ListBook;
