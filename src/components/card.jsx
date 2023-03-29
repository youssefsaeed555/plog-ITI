import { useContext, useEffect, useState } from "react";
import Avatar from "./avatar";
import Edit from "./edit";
import Trash from "./trash";
import axios from "axios";
import Loader from "./loader";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

export default function Card({
  postData,
  setPostData,
  handleDeletePost,
  searchQuery,
}) {
  //states
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  //handlers
  const handleReadMore = (id) => {
    return navigate(`/post/${id}`);
  };

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      if (location.pathname === "/myPosts") {
        const { data } = await axios.get(
          "https://plog-iti.onrender.com/api/v1/posts/getMyPosts/",
          config
        );
        setPostData(data.data);
      } else {
        const { data } = await axios.get(
          "https://plog-iti.onrender.com/api/v1/posts/",
          config
        );
        setPostData(data.data);
      }
      setLoading(false);
    };
    getPosts();
  }, []);

  //
  let filteredData = [];
  //apply search query if ensure there is data found in postData
  if (postData) {
    filteredData = postData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <>
      {(!postData?.length && loading === false) ||
      (filteredData?.length === 0 && loading === false) ? (
        <div className="text-center my-10 text-lg">
          <p className="text-white font-bold">No posts found to show </p>
        </div>
      ) : (
        ""
      )}

      <div className="grid grid-cols-2 gap-1">
        {loading === true ? (
          <div className="ml-auto flex">
            <span className="text-white font-bold">loading </span>
            <Loader></Loader>
          </div>
        ) : (
          <>
            {filteredData?.map((item) => (
              <div className="card p-2" key={item._id}>
                <div className="card bg-base-100 shadow-x">
                  <div className="flex justify-between align-middle items-center px-6">
                    <div className="flex justify-center align-middle py-2">
                      <div className="w-10 rounded-full">
                        {item.user.profileImg ? (
                          <img
                            src={item.user.profileImg}
                            className="w-13 h-11 rounded-full"
                          />
                        ) : (
                          <Avatar></Avatar>
                        )}
                      </div>
                      <span className=" ml-3 pt-2 font-bold">
                        {item.user.userName}
                      </span>
                    </div>
                    <div className="flex justify-center align-middle">
                      {item.user._id === userId?._id ? (
                        <>
                          <Edit
                            posts={postData}
                            postData={item}
                            setPostData={setPostData}
                          ></Edit>
                          <span className="pr-2"></span>
                          <Trash
                            postData={item._id}
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
                      {moment(item.createdAt).format("YYYY-MM-DD")} : {"  "}
                      {moment(item.createdAt).format("h:mm A")}
                    </span>
                  </div>
                  <figure>
                    <img
                      src={item.photo}
                      className="h-96 w-full object-fill"
                      alt="img"
                    />
                  </figure>
                  <div className="card-body overflow-hidden">
                    <h2 className="card-title">{item.title}</h2>
                    <p className="max-h-20 overflow-hidden text-ellipsis ">
                      {item.content}
                    </p>
                  </div>
                  <button
                    className="btn bg-purple-600 w-1/2 md:w-1/4 mx-auto mb-3"
                    onClick={() => handleReadMore(item._id)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
