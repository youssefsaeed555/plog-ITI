import { useContext, useState } from "react";
import axios from "axios";
import * as yup from "yup";
import "react-responsive-modal/styles.css";
import { ToastContainer, toast } from "react-toastify";

import Footer from "../components/footer";
import Input from "../components/input";
import Mail from "../components/mail";
import Avatar from "../components/avatar";
import editPhotoContext from "../context/editImage";
import Loader from "../components/loader";
import UserName from "../components/userName";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  //states
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [current, setCurrent] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //context
  const { editPhoto, setEditPhoto } = useContext(editPhotoContext);

  //variables
  const buttons = ["my profile", "Change photo", "Change password"];
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  //photo validation
  let photoSchema = yup.object({
    photo: yup
      .mixed()
      .required()
      .test("fileType", "Invalid file type", (value) =>
        ["image/jpeg", "image/png"].includes(value?.type)
      ),
  });

  //user validation
  let passwordSchema = yup.object({
    currentPassword: yup.string().required(),
    password: yup.string().required().min(8),
    confirmPassword: yup.string().required().min(8),
  });

  //user validation
  let userSchema = yup.object({
    userName: yup.string(),
    email: yup.string().email(),
  });

  //handlers
  const handleCurrent = (e) => {
    setCurrent(+e.target.value);
  };

  //handleChangePhoto
  const handleChangePhoto = async (e) => {
    e.preventDefault();
    // Set request headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      //validate inputs before send request
      await photoSchema.validate(
        {
          photo,
        },
        { abortEarly: false }
      );
      setLoading(true);
      const formData = new FormData();
      if (photo) {
        formData.append("profileImg", photo, photo.name);
      }
      const { data } = await axios.put(
        "https://plog-iti.onrender.com/api/v1/user/updatePhoto",
        formData,
        config
      );
      if (data.message === "photo update successfully") {
        user.profileImg = data.profileImg;
        localStorage.setItem("user", JSON.stringify(user));
        setPhoto(data.profileImg);
        setEditPhoto(true);
        toast.success("photo update successfully");
      }
    } catch (err) {
      let newError = [];
      if (err.errors) {
        newError = err.errors.map((err) => err);
      }
      if (err.response) {
        newError = err.response.data.errors.map((err) => err.msg);
      }
      localStorage.removeItem("post");
      newError.forEach((err) => {
        toast.error(err);
      });
    }
    setLoading(false);
  };

  //handle login submit
  const handleChangePassword = async (e) => {
    e.preventDefault();

    //validate passwords

    try {
      await passwordSchema.validate(
        {
          currentPassword,
          password,
          confirmPassword,
        },
        { abortEarly: false }
      );

      setLoading(true);
      // Set request headers with token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "https://plog-iti.onrender.com/api/v1/user/changePassword",
        {
          currentPassword,
          confirmPassword,
          password,
        },
        config
      );
      if (data.message == "update successfully") {
        localStorage.setItem("token", data.token);
        toast.success("change password success");
        setTimeout(() => {
          setCurrent(1);
          setCurrentPassword("");
          setPassword("");
          setConfirmPassword("");
        }, 1500);
      }
    } catch (err) {
      let newError = [];
      if (err.errors) {
        newError = err.errors.map((err) => err);
      }
      if (err.response) {
        newError = err.response.data.errors.map((err) => err.msg);
      }
      localStorage.removeItem("post");
      newError.forEach((err) => {
        toast.error(err);
      });
    }
    setLoading(false);
  };

  //handle edit userData
  const handleUserData = async (e) => {
    e.preventDefault();

    setLoading(true);
    // Set request headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await userSchema.validate(
        {
          email,
          userName,
        },
        { abortEarly: false }
      );

      if (!email && !userName) {
        throw Error("all fields is empty!");
      }
      const { data } = await axios.put(
        "https://plog-iti.onrender.com/api/v1/user/updateMe",
        {
          //if email found then spread email => email:'y@test.com'
          ...(email && { email }),
          ...(userName && { userName }),
        },
        config
      );
      if (data) {
        if (data.data.email) {
          user.email = data.data.email;
        }
        if (data.data.userName) {
          user.userName = data.data.userName;
        }
        // set updated user object back in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("user updated successfully");
        setEditPhoto(true);
        setTimeout(() => {
          setCurrent(1);
          setEmail("");
          setUserName("");
        }, 1500);
      }
    } catch (err) {
      let newError = [];
      if (err.errors) {
        newError = err.errors.map((err) => err);
      }
      if (err.message) {
        newError = [err.message];
      }
      if (err.response) {
        newError = err.response.data.errors.map((err) => err.msg);
      }
      newError.forEach((err) => {
        toast.error(err);
      });
    }
    setLoading(false);
  };

  //handleDeleteAccount
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    // Set request headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const discardChanges = window.confirm(
        "Are you sure you want to delete your account ?"
      );
      if (discardChanges) {
        await axios.delete(
          "https://plog-iti.onrender.com/api/v1/user/",
          config
        );
        // remove data from localStorage and navigate to login page
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        toast.success("user deleted successfully");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    } catch (err) {
      let newError = [];
      if (err.response) {
        newError = err.response.data.errors.map((err) => err.msg);
      }
      newError.forEach((err) => {
        toast.error(err);
      });
    }
  };

  return (
    <>
      <div
        className="hero "
        style={{
          backgroundImage: `url("/images/reset.svg")`,
          minHeight: "68.4vh",
          height: "auto",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div
          className="container mx-auto max-w-7xl"
          style={{ maxWidth: "100%" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10">
            <div className="btn-group btn-group-vertical p-4 md:p-6">
              {buttons.map((item, idx) => {
                return (
                  <button
                    className={`btn ${
                      current === idx + 1 ? "btn-active" : ""
                    } btn-wide p-8 md:p-14 `}
                    value={idx + 1}
                    onClick={handleCurrent}
                    key={idx}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="flex pt-10">
              <ToastContainer />
              <div className="md:w-64 h-64 ">
                {current === 1 && (
                  <>
                    <form onSubmit={handleUserData} className="ml-10 md:ml-0">
                      <div className="flex">
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          placeholder="Email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                        <Mail></Mail>
                      </div>
                      <div className="flex">
                        <Input
                          type="text"
                          id="userName"
                          name="userName"
                          placeholder="userName"
                          value={userName}
                          onChange={(e) => {
                            setUserName(e.target.value);
                          }}
                        />
                        <UserName></UserName>
                      </div>
                      <div className="form-control mt-6">
                        {loading === true ? (
                          <button className="btn btn-primary">
                            loading {<Loader> </Loader>}
                          </button>
                        ) : (
                          <button className="btn btn-primary">update</button>
                        )}
                      </div>
                      <div className="text-white pt-3 pl-5">
                        <p>Do you want to delete account?</p>
                      </div>
                      <div className="form-control mt-3">
                        <button
                          className="btn btn-error text-white"
                          type="button"
                          onClick={handleDeleteAccount}
                        >
                          delete account
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {current === 2 && (
                  <>
                    <div className="pl-10">
                      {user.profileImg ? (
                        <img
                          src={user.profileImg}
                          className="w-52 h-52 rounded-full"
                        ></img>
                      ) : (
                        <Avatar width={17} />
                      )}
                    </div>
                    <input
                      type="file"
                      className="file-input file-input-bordered file-input-info max-w-xl m-3"
                      name="profileImg"
                      id="profileImg"
                      onChange={(e) => {
                        if (e.target.files) {
                          setPhoto(e.target.files[0]);
                        }
                      }}
                    />

                    <div className="form-control mt-1">
                      {loading === true ? (
                        <span className="btn btn-primary btn-wide ml-6">
                          loading {<Loader> </Loader>}
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-wide ml-6"
                          onClick={handleChangePhoto}
                        >
                          update photo
                        </button>
                      )}
                    </div>
                  </>
                )}
                {current === 3 && (
                  <>
                    <form
                      onSubmit={handleChangePassword}
                      className="ml-10 md:ml-0"
                    >
                      <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="current password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                        }}
                      />

                      <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="new password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />

                      <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                      />
                      <div className="form-control mt-6">
                        {loading === true ? (
                          <span className="btn btn-primary">
                            loading {<Loader> </Loader>}
                          </span>
                        ) : (
                          <button className="btn btn-primary">
                            change password
                          </button>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
