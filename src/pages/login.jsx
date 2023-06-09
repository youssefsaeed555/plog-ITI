import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import Input from "../components/input";
import Loader from "../components/loader";
import useGuard from "../hooks/guard";
import Mail from "../components/mail";
import Password from "../components/password";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  //states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authToken, userId, logged] = useGuard();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //navigate to "/" if user write "/login" in url
  if (logged) {
    return <Navigate to="/" replace />;
  }

  // handle showPassword
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //handle login submit
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email || !password) {
        throw Error("missing inputs value");
      }
      const { data } = await axios.post(
        "https://plog-iti.onrender.com/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      if (data.message == "login success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("login success");
        setTimeout(() => {
          window.location.href = "/";
          window.location.replace = true;
        }, 1500);
      }
    } catch (err) {
      let error;
      if (err.message) {
        error = err.message;
      }
      if (err.response) {
        error = err.response.data.message;
      }
      toast.error(error);
    }
    setLoading(false);
  };

  const onSuccess = async (credentialResponse) => {
    if (credentialResponse) {
      document.body.style.overflowX = "hidden";
      try {
        setLoading(true);
        const { data } = await axios.post(
          "https://plog-iti.onrender.com/api/v1/auth/googleLogin",
          { googleToken: credentialResponse.credential }
        );
        if (data.message == "login success") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("login success");
          setTimeout(() => {
            window.location.href = "/";
            window.location.replace = true;
          }, 1500);
        }
      } catch (err) {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className="hero "
        style={{
          backgroundImage: `url("/images/reset.svg")`,
          minHeight: "100vh",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <ToastContainer />
          <img
            src="/images/login.gif"
            className="max-w-xs md:max-w-md rounded-lg shadow-2xl img "
          />
          <div className="card-body">
            <h1 className="text-2xl md:text-4xl text-center text-white">
              Login your account
            </h1>
            <form onSubmit={submit} className="flex flex-col w-64 md:w-full">
              <div className="flex m-2">
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
              <div className="flex m-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
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

              <label className="label ml-32">
                <Link
                  to="/resetPassword"
                  className="my-2 text-blue-500 underline hover:bg-blue-700"
                >
                  forgotten password?
                </Link>
              </label>
              <div className="form-control mt-6">
                {loading === true ? (
                  <span className="btn btn-primary">
                    loading {<Loader> </Loader>}
                  </span>
                ) : (
                  <button className="btn btn-primary w-56 ml-4 md:w-full md:ml-0">
                    Login
                  </button>
                )}
              </div>
              <span className="flex justify-center pt-2 text-white font-bold">
                or
              </span>
              <div className="pt-4 pl-6 md:pl-24">
                <GoogleLogin onSuccess={onSuccess} />
              </div>
              <label className="label">
                <span className="my-2 text-white">
                  Do you need new account?{" "}
                </span>
                <Link
                  to="/register"
                  className="text-blue-500 underline hover:bg-blue-700"
                >
                  create new account account
                </Link>
              </label>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
