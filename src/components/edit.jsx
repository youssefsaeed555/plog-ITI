import { useContext, useState } from "react";
import "react-responsive-modal/styles.css";
import { ToastContainer, toast } from "react-toastify";
import { Modal } from "react-responsive-modal";
import Loader from "./loader";
import Input from "./input";
import axios from "axios";
import editContext from "../context/editPost";

export default function Edit({ postData, setPostData, posts }) {
  //states
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [photo, setPhoto] = useState();
  const [open, setOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const { editPost, setEditPost } = useContext(editContext);

  //handlers
  const onOpenModal = () => {
    setOpen(true);
    setTitle(postData.title);
    setContent(postData.content);
  };
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
    //get token
    const token = localStorage.getItem("token");
    // Set request headers with token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const formData = new FormData();
    if (title) {
      formData.append("content", content);
    }
    if (content) {
      formData.append("content", content);
    }
    if (photo) {
      formData.append("photo", photo, photo.name);
    }
    //send request
    try {
      setLoading(true);
      const { data } = await axios.put(
        `https://plog-iti.onrender.com/api/v1/posts/${postData._id}`,
        {
          title,
          content,
          photo,
        },
        config
      );
      if (data) {
        //setNew data into current data
        postData.title = data.data.title;
        postData.content = data.data.content;
        postData.photo = data.data.photo;

        //update dom auto
        const index = posts.findIndex((post) => post._id === data.data._id);
        if (index > -1) {
          //clone
          const newPosts = [...posts];
          //edit
          newPosts[index] = data.data;
          //setState
          setPostData(newPosts);
          setEditPost(true);
        }
        //show message and delete data from modal and close modal
        toast.success("post updated successfully");
        setOpen(false);
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
    setLoading(false);
  };

  return (
    <>
      <button onClick={onOpenModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </button>
      <Modal open={open} onClose={handleClose} center>
        <h1 className="font-bold text-center text-xl uppercase">Edit post</h1>
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
              <button className="btn btn-primary">Edit</button>
            )}
          </div>
        </form>
        <ToastContainer></ToastContainer>
      </Modal>
    </>
  );
}
