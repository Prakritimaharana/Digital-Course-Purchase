import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FiBookOpen, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign, 
  FiStar, 
  FiUsers,
  FiAward,
  FiLayers,
  FiLifeBuoy,
  FiTrendingUp,
  FiChevronRight
} from "react-icons/fi";
import { motion } from "framer-motion";

const courses = [
  {
    id: 1,
    title: "React for Beginners",
    description: "Learn React from scratch with hands-on projects and build your first React applications.",
    price: 49900,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    instructor: "Jane Smith",
    thumbnail: "https://i.ytimg.com/vi/-AbaV3nrw6E/maxresdefault.jpg",
    category: "Web Development",
    lessons: 42,
    projects: 5
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts, design patterns, and modern ES6+ features.",
    price: 69900,
    duration: "8 weeks",
    level: "Advanced",
    rating: 4.9,
    students: 980,
    instructor: "John Doe",
    thumbnail: "https://stackify.com/wp-content/uploads/2018/10/JavaScript-Tutorials-for-Beginners-881x441-1.jpg",
    category: "Web Development",
    lessons: 56,
    projects: 7
  },
  {
    id: 3,
    title: "Complete Node.js Bootcamp",
    description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
    price: 79900,
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.7,
    students: 2100,
    instructor: "Mike Johnson",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Backend Development",
    lessons: 64,
    projects: 6
  },
  {
    id: 4,
    title: "Modern CSS & Sass",
    description: "Master modern CSS techniques including Flexbox, Grid, animations and Sass preprocessing.",
    price: 39900,
    duration: "4 weeks",
    level: "Intermediate",
    rating: 4.6,
    students: 1750,
    instructor: "Sarah Williams",
    thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Web Design",
    lessons: 28,
    projects: 4
  },
  {
    id: 5,
    title: "Python for Data Science",
    description: "Learn Python programming and data analysis with Pandas, NumPy, and Matplotlib.",
    price: 89900,
    duration: "12 weeks",
    level: "Beginner",
    rating: 4.9,
    students: 3200,
    instructor: "David Chen",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Data Science",
    lessons: 72,
    projects: 8
  },
  {
    id: 6,
    title: "AWS Certified Solutions Architect",
    description: "Prepare for the AWS certification with hands-on labs and real-world scenarios.",
    price: 99900,
    duration: "14 weeks",
    level: "Advanced",
    rating: 4.8,
    students: 850,
    instructor: "Alex Rodriguez",
    thumbnail: "https://media.geeksforgeeks.org/img-practice/prod/courses/651/Mobile/Content/Soln_1720780290.png",
    category: "Cloud Computing",
    lessons: 84,
    projects: 10
  },
];

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [unlockedCourses, setUnlockedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchAccess = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/payment/access/${user._id}`
          );
          if (res.data.success) {
            setUnlockedCourses(res.data.courseIds);
          }
        } catch (err) {
          console.error("Error fetching access:", err);
        }
      }
      setIsLoading(false);
    };

    fetchAccess();
  }, [user]);

  const handleBuyNow = async (course) => {
    if (!user) {
      alert("Please log in to buy a course");
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: course.price }
      );

      const options = {
        key: "rzp_test_xmtXQrdUArEApT",
        amount: course.price,
        currency: "INR",
        name: "Course Platform",
        description: course.title,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: user._id,
              courseId: course.id,
              courseTitle: course.title,
              amount: course.price,
            }
          );

          if (verifyRes.data.success) {
            alert("✅ Payment successful & course access granted!");
            setUnlockedCourses((prev) => [...prev, course.id]);
          } else {
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: user.fullname || "Student",
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during the payment process.");
    }
  };

  const handleAccessCourse = (course) => {
    navigate(`/course/${course.id}`);
  };

  const categories = ["All", ...new Set(courses.map(course => course.category))];
  const filteredCourses = activeCategory === "All" 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 40 L 40 40 40 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            variants={slideUp}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Transform Your Career With <span className="text-yellow-300">Online Learning</span>
          </motion.h1>
          
          <motion.p 
            variants={slideUp}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90"
          >
            Master modern skills with industry-leading courses taught by expert instructors
          </motion.p>
          
          <motion.div 
            variants={slideUp}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Explore Courses
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              How It Works
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-12 bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-gray-600">Students Enrolled</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">120+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">300+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Courses Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <motion.h2 
            variants={slideUp}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Featured Courses
          </motion.h2>
          <motion.p 
            variants={slideUp}
            className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4"
          >
            Hand-picked professional courses to boost your career
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div 
          variants={slideUp}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCourses.map((course) => (
            <motion.div 
              key={course.id}
              variants={slideUp}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20" />
                <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                  {course.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.level === "Beginner" 
                      ? "bg-green-100 text-green-800" 
                      : course.level === "Intermediate" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                  }`}>
                    {course.level}
                  </span>
                  <div className="flex items-center">
                    <FiStar className="fill-current text-yellow-400" />
                    <span className="ml-1 text-gray-700 font-medium">{course.rating}</span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-gray-500">{course.students.toLocaleString()} students</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <FiAward className="mr-2" />
                    <span>{course.projects} projects</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Price</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{(course.price / 100).toLocaleString()}
                    </span>
                  </div>
                  {unlockedCourses.includes(course.id) ? (
                    <button
                      onClick={() => handleAccessCourse(course)}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow hover:shadow-md"
                    >
                      <FiCheckCircle className="mr-2" />
                      Access Course
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyNow(course)}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow hover:shadow-md"
                    >
                      <FiDollarSign className="mr-2" />
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          variants={slideUp}
          className="mt-12 text-center"
        >
          <button className="px-8 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition duration-300 flex items-center mx-auto">
            View All Courses <FiChevronRight className="ml-2" />
          </button>
        </motion.div>
      </motion.section>

      {/* Learning Paths Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Structured Learning Paths
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Follow guided paths to master complex topics step by step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-100 text-indigo-600 mb-6">
                <FiLayers className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Frontend Developer</h3>
              <p className="text-gray-600 mb-4">
                Master HTML, CSS, JavaScript and modern frameworks like React and Vue.js
              </p>
              <div className="flex items-center text-indigo-600 font-medium">
                Explore Path <FiChevronRight className="ml-1" />
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-green-100 text-green-600 mb-6">
                <FiTrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Scientist</h3>
              <p className="text-gray-600 mb-4">
                Learn Python, data analysis, machine learning and visualization tools
              </p>
              <div className="flex items-center text-indigo-600 font-medium">
                Explore Path <FiChevronRight className="ml-1" />
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-purple-100 text-purple-600 mb-6">
                <FiLifeBuoy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">DevOps Engineer</h3>
              <p className="text-gray-600 mb-4">
                Master Docker, Kubernetes, CI/CD and cloud infrastructure
              </p>
              <div className="flex items-center text-indigo-600 font-medium">
                Explore Path <FiChevronRight className="ml-1" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Learn With Us
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              We provide the best learning experience for our students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 mb-6">
                <FiBookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Project-Based Learning</h3>
              <p className="text-gray-600">
                Learn by building real-world projects that you can add to your portfolio
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 text-green-600 mb-6">
                <FiClock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Self-Paced Learning</h3>
              <p className="text-gray-600">
                Learn at your own pace with lifetime access to all course materials
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-100 text-purple-600 mb-6">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with real-world experience
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-yellow-100 text-yellow-600 mb-6">
                <FiAward className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Certification</h3>
              <p className="text-gray-600">
                Earn certificates to showcase your skills to employers
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
              Hear from our students who transformed their careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  AS
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Amit Sharma</h4>
                  <p className="text-gray-500">React Developer @TechCorp</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic">
                "The React course was exactly what I needed to transition from my marketing career to tech. Within 6 months of completing the course, I landed my first developer job!"
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                  PK
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Priya Kumar</h4>
                  <p className="text-gray-500">Data Scientist @DataInsights</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic">
                "The Python for Data Science course gave me the practical skills I needed to advance in my career. The projects were challenging but incredibly rewarding."
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                  RS
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Rahul Singh</h4>
                  <p className="text-gray-500">DevOps Engineer @CloudScale</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic">
                "The AWS certification course prepared me thoroughly for the exam. The hands-on labs were exactly what I needed to gain practical experience."
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-r from-indigo-600 to-purple-700"
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to advance your career?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-indigo-100">
              Join over 50,000 students who have transformed their careers with our courses
            </p>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 flex justify-center"
            >
              <button className="px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 transition duration-300 shadow-lg">
                Start Learning Today
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Webinars</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Feedback</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2023 Course Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;