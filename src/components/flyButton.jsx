import { useContext, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Input from "./input";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./loader";
import * as yup from "yup";

export default function FlyButton({ handleAddPost }) {
  //states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  //validation
  let postSchema = yup.object({
    title: yup.string().required().min(8),
    content: yup.string().required().min(8),
    photo: yup
      .mixed()
      .required()
      .test("fileType", "Invalid file type", (value) =>
        ["image/jpeg", "image/png"].includes(value?.type)
      ),
  });

  //handlers
  const onOpenModal = () => setOpen(true);
  function handleClose() {
    if (unsavedChanges === false) {
      const discardChanges = window.confirm(
        "Are you sure you want to discard changes?"
      );
      if (discardChanges) {
        setOpen(false);
        setUnsavedChanges(false);
        setPhoto(null);
        setContent("");
        setTitle("");
      }
    } else {
      setOpen(true);
    }
  }

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // Set request headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    //set file config
    const formData = new FormData();
    if (photo && title && content) {
      formData.append("photo", photo, photo.name);
      formData.append("title", title);
      formData.append("content", content);
    }

    try {
      //validate inputs before send request
      await postSchema.validate(
        {
          title,
          content,
          photo,
        },
        { abortEarly: false }
      );
      setLoading(true);
      const { data } = await axios.post(
        "https://plog-iti.onrender.com/api/v1/posts/",
        formData,
        config
      );
      if (data) {
        localStorage.setItem("post", JSON.stringify(data.data));
        toast.success("post created successfully");
        setOpen(false);
        setTimeout(() => {
          setPhoto(null);
          setContent("");
          setTitle("");
        }, 2000);
        handleAddPost(data.data);
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

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full fixed bottom-0 lg:right-0 lg:m-4 sm:m-4"
        onClick={onOpenModal}
      >
        +
      </button>
      <Modal open={open} onClose={handleClose} center>
        <h1 className="font-bold text-center text-xl uppercase">
          create a post
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-96 pb-3 gap-4">
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <textarea
              placeholder="Post content"
              className="textarea textarea-info max-w-xl py-3 m-1"
              id="content"
              name="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value || " ");
              }}
            ></textarea>
            <input
              type="file"
              className="file-input file-input-bordered file-input-info max-w-xl  m-1"
              name="photo"
              id="photo"
              onChange={(e) => {
                if (e.target.files) {
                  setPhoto(e.target.files[0]);
                }
              }}
            />
            {loading === true ? (
              <button className="btn btn-primary">
                loading {<Loader> </Loader>}
              </button>
            ) : (
              <button className="btn btn-primary">Create</button>
            )}
          </div>
        </form>
        <ToastContainer></ToastContainer>
      </Modal>
    </>
  );
}
