import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Avatar from "../components/avatar";
import Edit from "../components/edit";
import Trash from "../components/trash";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader";
import Footer from "../components/footer";
import { memo } from "react";
import editContext from "../context/editPost";

const GetPost = ({ handleDeletePost, postsData, setPostsData }) => {
  //states
  const [postData, setPostData] = useState();
  //flag to check if post editing or not
  const [loading, setLoading] = useState(false);
  const { editPost, setEditPost } = useContext(editContext);
  const { id } = useParams();
  const navigate = useNavigate();

  //variables
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"));

  // Set request headers with token
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  let isMounted = true; // add a flag to track whether the component is mounted
  const getPost = async () => {
    try {
      if (!id) {
        return navigate("/");
      }
      const { data } = await axios.get(
        `https://plog-iti.onrender.com/api/v1/posts/${id}`,
        config
      );
      if (data && isMounted) {
        setLoading(false);
        // check if the component is still mounted before updating the state
        setPostData(data.data);
        setEditPost(false);
      }
    } catch (err) {
      console.log(err);
      if (!id || err) {
        return navigate("/");
      }
    }
  };

  useEffect(() => {
    getPost();
    setLoading(true);
    return () => {
      isMounted = false; // set the flag to false when the component is unmounted
    };
  }, [editPost]);

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
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-1">
            {loading === true ? (
              <div className="fixed top-1/2 left-1/2  ml-auto flex h-screen">
                <span className="text-white font-bold">loading </span>
                <Loader></Loader>
              </div>
            ) : (
              <div className="card p-2">
                <div className="card bg-base-100 shadow-xl">
                  <div className="flex justify-between align-middle items-center px-6">
                    <div className="flex justify-center align-middle py-2">
                      <div className="w-10 rounded-full">
                        {postData?.user?.profileImg ? (
                          <img
                            src={postData?.user.profileImg}
                            className="w-13 h-11 rounded-full"
                          />
                        ) : (
                          <Avatar></Avatar>
                        )}
                      </div>
                      <span className=" ml-3 pt-2 font-bold">
                        {postData?.user?.userName}
                      </span>
                    </div>
                    <div className="flex justify-center align-middle">
                      {postData?.user?._id === userId._id ? (
                        <>
                          <Edit
                            posts={postsData}
                            postData={postData}
                            setPostData={setPostData}
                          ></Edit>
                          <span className="pr-2"></span>
                          <Trash
                            postData={postData._id}
                            setPostData={setPostData}
                            handleDeletePost={handleDeletePost}
                          ></Trash>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="flex align-middle justify-center">
                    <span className="text-gray-500">
                      {moment(postData?.createdAt).format("YYYY-MM-DD")} :{" "}
                      {"  "}
                      {moment(postData?.createdAt).format("h:mm A")}
                    </span>
                  </div>
                  <figure>
                    <img src={postData?.photo} alt="Shoes" />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{postData?.title}</h2>
                    <p>{postData?.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default memo(GetPost);
