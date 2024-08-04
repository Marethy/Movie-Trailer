import IconRatingHalf from "../assets/rating-half.png";
import IconRating from "../assets/rating.png";
import ImgMovie from "../assets/temp-1.jpeg";
import IconPlay from "../assets/play-button.png";


const Banner = () => {
  return (
    <div className="relative w-full md:h-[600px] h-[1000px] bg-banner bg-cover bg-center bg-no-repeat mt-[75px]">
      <div className="w-full h-full bg-black/40 absolute inset-0" />
      <div className="flex flex-col md:flex-row items-center justify-between absolute md:top-1/2 top-10 -translate-x-1/2 left-1/2 md:-translate-y-1/2 w-full">
        <div className="md:w-[50%] w-full p-6 md:p-10">
          {/* <div className="bg-gradient-to-r  from-red-600 to-red-300 text-white font-bold uppercase rounded py-2 px-6 fixed">
            Top 10 on IMDb this week
          </div> */}
          <div className="flex flex-col space-y-6 mt-6">
            <p className="bg-gradient-to-r from-red-600 to-red-300 text-white font-bold rounded py-2 px-6 fixed ">
              TV Show
            </p>
            <div className="flex flex-col space-y-4">
              <h1 className="text-[40px] font-bold text-white">
                Nghe nói em thích tôi
              </h1>
              <div className="flex items-center space-x-3">
                <img src={IconRating} alt="rating" className="w-8 h-8" />
                <img src={IconRating} alt="rating" className="w-8 h-8" />
                <img src={IconRating} alt="rating" className="w-8 h-8" />
                <img src={IconRating} alt="rating" className="w-8 h-8" />
                <img src={IconRatingHalf} alt="rating" className="w-8 h-8" />
              </div>
              <p className="text-white">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting.feda
              </p>
            </div>

            <div className="flex items-center space-x-5">
              <button className="py-2 px-3 bg-black text-white  font-bold rounded-xl">
                Chi tiết
              </button>
              <button className="py-2 px-3 bg-red-600 text-white font-bold rounded-xl">
                Xem Phim
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-[50%] w-full flex items-center justify-center">
          <div className="w-[300px] h-[400px] relative group">
            <button className="w-full h-full absolute top-0 left-0 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
              <img src={IconPlay} alt="play" className="w-16 h-16" />
            </button>
            <img
              src={ImgMovie}
              alt="banner"
              className="object-cover w-full h-full rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Banner;
