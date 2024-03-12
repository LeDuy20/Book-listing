import axios from "../services/customer-axios";

const createUserRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};
const loginUser = (username, password) => {
  return axios.post("/api/v1/auth/login", { username, password });
};
const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account");
};
const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};
// admin user
const fetchUser = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};
const createNewUser = (fullName, password, phone, email) => {
  return axios.post(`api/v1/user`, { fullName, password, phone, email });
};
const callBulkCreateUser = (data) => {
  return axios.post(`api/v1/user/bulk-create`, data);
};
const callUpdateUser = (_id, fullName, phone) => {
  return axios.put(`api/v1/user`, { _id, fullName, phone });
};
const callDeteleUser = (userId) => {
  return axios.delete(`/api/v1/user/${userId}`);
};

//admin book
const fetchBook = (query) => {
  return axios.get(`api/v1/book?${query}`);
};
const callCategory = () => {
  return axios.get("api/v1/database/category");
};

const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

const callCreateBook = (
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.post("api/v1/book", {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};
const callUpdateBook = (
  id,
  mainText,
  author,
  price,
  sold,
  quantity,
  category,
  thumbnail,
  slider
) => {
  return axios.put(`api/v1/book/${id}`, {
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

const callDeleteBook = (bookId) => {
  return axios.delete(`api/v1/book/${bookId}`);
};

const callFetchBookById = (id) => {
  return axios.get(`api/v1/book/${id}`);
};
export {
  createUserRegister,
  loginUser,
  callFetchAccount,
  callLogout,
  fetchUser,
  createNewUser,
  callBulkCreateUser,
  callUpdateUser,
  callDeteleUser,
  fetchBook,
  callCategory,
  callUploadBookImg,
  callCreateBook,
  callUpdateBook,
  callDeleteBook,
  callFetchBookById,
};
