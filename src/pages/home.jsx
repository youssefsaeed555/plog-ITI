import Card from "../components/card";
import Carousel from "../components/carousel";
import FlyButton from "../components/flyButton";
import Footer from "../components/footer";

export default function Home({
  postData,
  setPostData,
  handleDeletePost,
  handleAddPost,
  searchQuery,
}) {
  return (
    <>
      <div>
        <Carousel></Carousel>
      </div>
      <div
        className="relative bottom-0 bg-opacity-60"
        style={{
          top: "40.9rem",
        }}
      >
        <div
          className="hero"
          style={{
            backgroundImage: `url("/images/reset.svg")`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>{" "}
          <div className="container mx-auto max-w-7xl">
            <div className="hero text-white font-bold">
              <div
                className="hero-content text-center"
                style={{ padding: "50px" }}
              >
                <div className="max-w-lg">
                  <h1 className="text-4xl font-bold">
                    welcome in our movie plog
                  </h1>
                  <p className="py-5 text-base">
                    The Official Home of Correct Movie Opinions, Go behind the
                    scenes of your favorite movies with on-set reporting
                  </p>
                </div>
              </div>
            </div>
            <Card
              postData={postData}
              setPostData={setPostData}
              handleDeletePost={handleDeletePost}
              searchQuery={searchQuery}
            ></Card>
          </div>
        </div>
        <FlyButton handleAddPost={handleAddPost}></FlyButton>
        <Footer></Footer>
      </div>
    </>
  );
}
