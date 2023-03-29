import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import Mail from "../components/mail";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Loader from "../components/loader";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      if (!email) {
        throw Error("please input your mail");
      }
      setLoading(true);
      const { data } = await axios.post(
        "https://plog-iti.onrender.com/api/v1/auth/forgetPassword",
        {
          email,
        }
      );
      if (data.message == "email sent successfully") {
        toast.success("code sent successfully");
        setTimeout(() => {
          navigate("/verifyCode");
        }, 1500);
      }
    } catch (err) {
      let newError = [];
      if (err.message) {
        newError = [err.message];
      }
      if (err.response) {
        newError = [err.response.data.message];
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
            Please type your email to send you verify code
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
          {loading === true ? (
            <span className="btn btn-primary">
              loading {<Loader> </Loader>}
            </span>
          ) : (
            <button
              className="btn btn-primary mt-5"
              onClick={handleResetPassword}
            >
              reset
            </button>
          )}

          <ToastContainer></ToastContainer>
        </div>
      </div>
    </div>
  );
}
