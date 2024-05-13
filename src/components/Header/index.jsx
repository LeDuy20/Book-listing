import React, { useState } from "react";
import "./Header.scss";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Avatar, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Popover } from "antd";
import { useNavigate } from "react-router";
import { callLogout } from "../../services/UserServices";
import { doLogoutAction } from "../../redux/account/accountSlice";
import InfoUser from "../InfoUser/InfoUser";

const Header = (props) => {
  const { search, setSearch } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.order.carts);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/login");
    }
  };
  // const handleSearch = (e) => {
  //   setSearch(e.target.value);
  // };
  // const deBounceHandleSearch = debounce(handleSearch, 200);
  const items = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => navigate("/admin")}>
          Quản trị người dùng
        </label>
      ),
      key: "admin",
    },
    {
      label: (
        <div>
          <label
            style={{ cursor: "pointer" }}
            onClick={() => setShowModal(true)}
          >
            Quản lý tài khoản
          </label>
          <InfoUser setShowModal={setShowModal} showModal={showModal} />
        </div>
      ),
      key: "account",
    },
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/history")}
        >
          Lịch sử mua hàng
        </label>
      ),
      key: "history",
    },
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleLogout();
          }}
        >
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  //popover carts
  const text = <span style={{ fontSize: 16 }}>Giỏ hàng</span>;

  const content = (
    <div>
      {carts.map((item, index) => {
        return (
          <div
            key={`index-${index}`}
            style={{
              display: "flex",
              gap: 10,
              fontSize: 16,
              fontWeight: 500,
              padding: "10px 0",
            }}
          >
            <img
              style={{ height: 70, width: 70 }}
              src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                item.detail.thumbnail
              }`}
              alt=""
            />
            <p style={{ width: 250 }}>
              {item.detail.mainText}{" "}
              <span style={{ marginLeft: 20 }}>x{item.quantity}</span>
            </p>
            <span style={{ color: "#ee4d2d" }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.detail.price * item.quantity)}
            </span>
          </div>
        );
      })}
      {carts.length > 0 ? (
        <div className="carts-pop-button">
          <button onClick={() => navigate("/cart")}>Xem giỏ hàng</button>
        </div>
      ) : (
        <p>Không có sản phẩm nào trong giỏ hàng</p>
      )}
    </div>
  );
  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo" onClick={() => navigate("/")}>
                <FaReact className="rotate icon-react" /> LE DUY
                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  placement="topRight"
                  title={text}
                  content={content}
                  arrow={true}
                >
                  <Badge
                    count={carts?.length ?? 0}
                    size={"small"}
                    showZero
                    onClick={() => navigate("/cart")}
                  >
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                    style={{ display: "flex", marginTop: 10 }}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Avatar src={urlAvatar} />
                        {user?.fullName}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Trang chủ
        </p>
        <Divider />
        <div>
          <p style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
            Quản lý tài khoản
          </p>

          <InfoUser setShowModal={setShowModal} showModal={showModal} />
        </div>
        <Divider />
        <p style={{ cursor: "pointer" }} onClick={() => navigate("/history")}>
          Lịch sử mua hàng
        </p>
        <Divider />
        <p
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleLogout();
          }}
        >
          Đăng xuất
        </p>
        <Divider />
      </Drawer>
    </>
  );
};

export default Header;
