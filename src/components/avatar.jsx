export default function Avatar({ width }) {
  return (
    <div className="avatar">
      <div className={`${width ? `w-${width}` : "w-10"} rounded-full`}>
        <img src="/images/avatar1.avif" />
      </div>
    </div>
  );
}
