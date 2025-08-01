import logo from "../../src/assets/logo.png";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import BACKEND_URL from '../utilts/utilts.js'

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
    useEffect(() => {
     const user = localStorage.getItem("user");
     if(user){
      setIsLoggedIn(true);
     }
     else{
      setIsLoggedIn(false)
     }
  }, [])
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}course/courses`,
          {
            withCredentials: true,
          }
        )
        console.log(response,response.data);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("Error in fetching course", error);
      }
    };
    fetchCourses();
  }, []);


  

  const handleLogout = async()=>{
    try {
     const response = await axios.post(`${BACKEND_URL}users/logout`,{
        withCredentials:true
      })
      toast.success("Logout Successfully",(response).data.message)
      setIsLoggedIn(false);
      localStorage.removeItem("user");
    } catch (error) {
      console.log("Error in Logout", error)
      toast.error("Error in Logout"|| error.response.data.errors)
    }
  }
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay:true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900">
      <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-2 mt-3">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 className="font-2xl text-orange-500 font-bold">
              Vidya Niketan
            </h1>
          </div>
          <div className=" flex items-center space-x-6 mt-4">
            {isLoggedIn ? (
              <>
             <button
               onClick={handleLogout}
              className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-black hover:py-1 hover:px-2 duration-300"
            >
              Logout
            </button>
            </>
            ) : (
              <>
             <Link
              to={"/login"}
              className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-black hover:py-1 hover:px-2 duration-300"
            >
              Login
            </Link>
            <Link
              to={"/signup"}
              className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-black hover:py-1 hover:px-2 duration-300"
            >
              Signup
            </Link>
            </>
            )

            }
          </div>
        </header>

        <section className="text-center py-20">
          <h1 className="text-4xl font-semibold text-orange-500">
            Vidya Niketan
          </h1>
          <br />
          <p className=" text-gray-500">
            Here we provide some special courses for you with exciting offers
          </p>
          <div className="space-x-4 mt-8">
            <Link to={"/courses"} className="bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black">
              Explore Courses
            </Link>
            <Link to={"https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w"} className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white">
              Courses Videoes
            </Link>
          </div>
        </section>
        <section className="p-6">
            <Slider {...settings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <img className="h-32 w-full object-contain mt-3 rounded-lg" src={course.image?.url} alt="" />
                      <div className="p-6 text-center">
                        <h2 className="text-xl font-bold text-white mb-6">{course.title}</h2>
                        <Link to="/courses" className="mt-8 bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-blue-500 duration-300">Enroll Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
        </section>
        <hr />
        {/* footer */}
        <footer className="my-8">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mt-3">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="font-2xl text-orange-500 font-bold">
                  Vidya Niketan
                </h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-3 ml-3">Follw Us</p>
                <div className="flex space-x-4">
                  <a href="">
                    <FaFacebookF className="text-2xl hover:text-blue-600 text-2xld duration-300" />
                  </a>
                  <a href="">
                    <FaInstagram className="text-2xl hover:text-pink-600 text-2xld duration-300" />
                  </a>
                  <a href="">
                    <FaGithub className="text-2xl hover:text-grey-600 text-2xld duration-300" />
                  </a>
                </div>
              </div>
            </div>
            <div className="items-center flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Connects</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Youtube- Vidya Niketan
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Telegram- Vidya Niketan
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Github- Vidya Niketan
                </li>
              </ul>
            </div>
            <div className="items-center flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                Copyrights &#169; 2025
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
