import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import Mail from "../components/mail";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Loader from "../components/loader";
import Password from "../components/password";
import * as yup from "yup";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // handle showPassword
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //user validation
  let passwordSchema = yup.object({
    password: yup.string().required().min(8),
    email: yup.string().email().required(),
  });

  const changePassword = async () => {
    try {
      await passwordSchema.validate(
        {
          password,
          email,
        },
        { abortEarly: false }
      );

      if (!email || !password) {
        throw Error("there are fields empty");
      }

      setLoading(true);
      const { data } = await axios.put(
        "https://plog-iti.onrender.com/api/v1/auth/resetPassword",
        {
          password,
          email,
        }
      );
      if (data.message == "update password successfully") {
        toast.success("password updated successfully");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = "/";
          window.location.replace = true;
        }, 1500);
      }
    } catch (err) {
      let newError = [];
      if (err.errors) {
        newError = err.errors.map((err) => err);
      }
      if (err.response) {
        newError.push(err.response.data.message);
      }
      newError.forEach((err) => {
        toast.error(err);
      });
    }
    setLoading(false);
  };

  return (
    <div
      className="hero "
      style={{
        backgroundImage: `url("/images/reset.svg")`,
        minHeight: "100vh",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <p className="mb-5">
            {" "}
            Please type your mail again and your new password
          </p>
          <div className="flex m-2 text-black">
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
          <div className="flex m-2 text-black">
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

          {loading === true ? (
            <span className="btn btn-primary">
              loading {<Loader> </Loader>}
            </span>
          ) : (
            <button className="btn btn-primary mt-5" onClick={changePassword}>
              change password
            </button>
          )}

          <ToastContainer></ToastContainer>
        </div>
      </div>
    </div>
  );
}
