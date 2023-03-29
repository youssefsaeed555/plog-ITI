import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Header from "./components/header";
import Home from "./pages/home";
import Register from "./pages/resgister";
import ProtectRoute from "./hooks/protectRoute";
import useGuard from "./hooks/guard";
import GetPost from "./pages/getPost";
import { EditPostsProvider } from "./context/editPost";
import { EditPhotoProvider } from "./context/editImage";
import MyPosts from "./pages/myPosts";
import Profile from "./pages/profile";
import ResetPassword from "./pages/resetPassword";
import VerifyCode from "./pages/verifyCode";
import ChangePassword from "./pages/changePassword";
import NotFound from "./pages/404";

function App() {
  //can't remove authToken, userId because it destruct array based on its index
  const [authToken, userId, logged] = useGuard();
  const [postData, setPostData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddPost = (post) => {
    if (postData === undefined) {
      setPostData([post]);
    }
    let newArray = [post, ...postData];
    setPostData(newArray);
  };

  const handleDeletePost = (postId) => {
    setPostData(postData.filter((post) => post._id !== postId));
  };

  return (
    <>
      <EditPostsProvider>
        <EditPhotoProvider>
          <BrowserRouter>
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            ></Header>
            <Routes>
              <Route
                path="/login"
                element={<Login logged={logged}></Login>}
              ></Route>
              <Route path="/resetPassword" element={<ResetPassword />}></Route>
              <Route path="/verifyCode" element={<VerifyCode />}></Route>
              <Route
                path="/changePassword"
                element={<ChangePassword />}
              ></Route>
              <Route path="/register" element={<Register></Register>}></Route>
              <Route element={<ProtectRoute auth={logged} />}>
                <Route
                  path="/"
                  element={
                    <Home
                      postData={postData}
                      setPostData={setPostData}
                      handleDeletePost={handleDeletePost}
                      handleAddPost={handleAddPost}
                      searchQuery={searchQuery}
                    />
                  }
                ></Route>
                <Route
                  path="/post/:id"
                  element={
                    <GetPost
                      postsData={postData}
                      setPostsData={setPostData}
                      handleDeletePost={handleDeletePost}
                    />
                  }
                ></Route>
                <Route
                  path="/myPosts"
                  element={
                    <MyPosts
                      postData={postData}
                      setPostData={setPostData}
                      handleDeletePost={handleDeletePost}
                      handleAddPost={handleAddPost}
                      searchQuery={searchQuery}
                    ></MyPosts>
                  }
                ></Route>
                <Route path="/profile" element={<Profile></Profile>}></Route>
              </Route>
              <Route path="*" element={<NotFound></NotFound>}></Route>
            </Routes>
          </BrowserRouter>
        </EditPhotoProvider>
      </EditPostsProvider>
    </>
  );
}

export default App;
