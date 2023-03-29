import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { object, string } from "yup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import Input from "../components/input";
import Loader from "../components/loader";
import UserName from "../components/userName";
import Mail from "../components/mail";
import Password from "../components/password";

export default function Register() {
  //states
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //validation
  let userSchema = object({
    userName: string().required(),
    password: string().required().min(8),
    email: string().email().required(),
    confirmPassword: string().required().min(8),
  });

  // handle showPassword
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //handle submit
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userSchema.validate(
        {
          email,
          password,
          confirmPassword,
          userName,
        },
        { abortEarly: false }
      );
      const { data } = await axios.post(
        "https://plog-iti.onrender.com/api/v1/auth/signup",
        {
          email,
          password,
          userName,
          confirmPassword,
        }
      );
      if (data.message == "created successfully") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        toast.success("created successfully");
        setTimeout(() => {
          window.location.href = "/";
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      newError.forEach((err) => {
        toast.error(err);
      });
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className="hero "
        style={{
          backgroundImage: `url("../src/assets/images/reset.svg")`,
          minHeight: "100vh",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>

        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="../../src/assets/images/an.gif"
            className="max-w-lg rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl text-center text-white">
              Register new account
            </h1>
            <form onSubmit={submit}>
              <div className="flex m-2">
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
              <div className="flex m-2">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <Mail></Mail>
              </div>
              <div className="flex m-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <Password
                  showPassword={showPassword}
                  handleShowPassword={handleShowPassword}
                ></Password>
              </div>
              <div className="flex m-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
              <label className="label flex justify-around my-1">
                <span className="text-white">Do you have account?</span>
                <Link
                  to="/login"
                  className="text-blue-500 underline hover:bg-blue-700"
                >
                  Login
                </Link>
              </label>

              <ToastContainer />

              <div className="form-control mt-6">
                {loading === true ? (
                  <span className="btn btn-primary">
                    loading {<Loader> </Loader>}
                  </span>
                ) : (
                  <button className="btn btn-primary">Register</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
