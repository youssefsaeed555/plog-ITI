import { useEffect, useState } from "react";

export default function Carousel() {
  const [index, setIndex] = useState(0);

  const img = [
    {
      img: "../src/assets/movies/8.jpg",
      caption:
        "We go together like movies and popcorn. When the sun sets, the movie begins.",
    },
    {
      img: "../src/assets/movies/7.jpg",
      caption: "It may sound corny, but movie nights with you are my favorite.",
    },
    {
      img: "../src/assets/movies/4.jpg",
      caption: "I don't know if I can ever go back to watching a movie inside.",
    },
    {
      img: "../src/assets/movies/9.jpg",
      caption:
        "Every time I go to a movie, it's magic, no matter what the movie's about.",
    },
    {
      img: "../src/assets/movies/6.jpg",
      caption:
        "Watching movie stars under the stars, Shhh the show's about to begin",
    },
    {
      img: "../src/assets/movies/3.jpg",
      caption: "The actors aren't the only stars I'm seeing tonight.",
    },
  ];
  useEffect(() => {
    //make initial value to avoid some bug if condition not true
    let intervalId = null;
    if (index < img.length - 1) {
      intervalId = setInterval(() => {
        //update state based on previous value
        setIndex((prevIndex) => prevIndex + 1);
      }, 1500);
    }
    return () => {
      //ensure intervalId not null, because this call back execute after every render
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [index]);
  useEffect(() => {
    //separate because i doesn't want this code to execute every render
    if (index === img.length - 1) {
      setIndex(0);
    }
  }, [index]);

  return (
    <div className=" carousel carousel-center rounded-box ">
      <div id="item1" className="carousel-item ">
        <img
          src={img[index].img}
          key={index}
          className="absolute top-0 left-0 w-full h-full object-fit opacity-90"
        ></img>
        <div className="absolute inset-0 flex items-center justify-center ">
          <p className="text-white text-xl font-bold">{img[index].caption}</p>
        </div>
      </div>
    </div>
  );
}
