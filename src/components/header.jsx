import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "./avatar";
import { useContext, useEffect, useState } from "react";
import editPhotoContext from "../context/editImage";

export default function Header({ searchQuery, setSearchQuery }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const { editPhoto, setEditPhoto } = useContext(editPhotoContext);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    setEditPhoto(false);
  }, [editPhoto]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("logged");

    toast.info("logout successfully");
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  };

  const handleHomeClick = () => {
    return navigate("/");
  };

  return (
    <>
      {location.pathname == "/login" ||
      location.pathname == "/register" ||
      location.pathname == "/resetPassword" ||
      location.pathname == "/verifyCode" ||
      location.pathname == "/changePassword" ? (
        false
      ) : (
        <div className="navbar bg-gradient-to-l  from-purple-800 to-blue-500 sticky top-0 z-50 ">
          <div className="navbar-start">
            <ToastContainer />
            <button onClick={handleHomeClick}>
              <a
                className="btn btn-ghost normal-case text-xl text-white font-bold"
                onClick={() => window.scrollTo(0, 0)}
              >
                Home
              </a>
            </button>
          </div>
          {!location.pathname.startsWith("/post") &&
            !location.pathname.startsWith("/profile") &&
            !location.pathname.startsWith("/resetPassword") && (
              <div className="navbar-center flex-1">
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-44"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            )}

          {!location.pathname.startsWith("/resetPassword") && (
            <div className="navbar-end flex-wrap ">
              <span className="text-base md:text-lg text-white font-bold">
                {user?.userName}
              </span>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-9 rounded-full">
                    {user?.profileImg ? (
                      <img src={user?.profileImg} />
                    ) : (
                      <Avatar></Avatar>
                    )}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-48"
                >
                  <li>
                    <Link to="/profile" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/myPosts">My posts</Link>
                  </li>
                  <li>
                    <button className="link no-underline" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
