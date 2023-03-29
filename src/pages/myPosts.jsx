import Card from "../components/card";
import Footer from "../components/footer";

export default function MyPosts({
  postData,
  setPostData,
  handleDeletePost,
  searchQuery,
}) {
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
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-center items-center">
            {postData && (
              <div className="max-w-lg">
                <h1 className="text-3xl font-bold pb-6 text-white">My Posts</h1>
              </div>
            )}
          </div>
          <Card
            postData={postData}
            setPostData={setPostData}
            handleDeletePost={handleDeletePost}
            searchQuery={searchQuery}
          ></Card>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
