export default function NotFound() {
  return (
    <div
      className="hero "
      style={{
        backgroundImage: `url("../src/assets/images/reset.svg")`,
        minHeight: "90.8vh",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <img src="../src/assets/images/404.png"></img>
    </div>
  );
}
