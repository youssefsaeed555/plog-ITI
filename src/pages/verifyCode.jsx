import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import Mail from "../components/mail";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Loader from "../components/loader";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyCode = async () => {
    try {
      if (!code) {
        throw Error("please input your code");
      }
      setLoading(true);
      const { data } = await axios.post(
        "https://plog-iti.onrender.com/api/v1/auth/verifyCode",
        {
          code,
        }
      );
      if (data.message == "success") {
        toast.success("verify code successfully");
        setTimeout(() => {
          navigate("/changePassword");
        }, 1500);
      }
    } catch (err) {
      let newError;
      if (err.message) {
        newError = err.message;
      }
      if (err.response) {
        newError = err.response.data.message;
      }
      toast.error(newError);
    }
    setLoading(false);
  };

  return (
    <div
      className="hero "
      style={{
        backgroundImage: `url("../src/assets/images/reset.svg")`,
        minHeight: "100vh",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <p className="mb-5"> Please type your code send in your mail</p>
          <div className="flex m-2 text-black">
            <Input
              type="number"
              id="code"
              name="code"
              value={code}
              placeholder="Code"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          </div>
          {loading === true ? (
            <span className="btn btn-primary">
              loading {<Loader> </Loader>}
            </span>
          ) : (
            <button className="btn btn-primary mt-5" onClick={verifyCode}>
              verify
            </button>
          )}

          <ToastContainer></ToastContainer>
        </div>
      </div>
    </div>
  );
}
