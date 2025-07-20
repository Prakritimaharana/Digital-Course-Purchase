import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FiBook, FiCheckCircle, FiDownload, FiPlay, FiClock, FiBarChart2, FiAward, FiChevronDown, FiChevronUp, FiStar, FiHeart, FiShare2, FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const courses = {
  1: {
    id: 1,
    title: "React for Beginners",
    description: "Learn React from scratch with hands-on projects and build your first React applications.",
    instructor: "Jane Smith",
    thumbnail: "https://i.ytimg.com/vi/-AbaV3nrw6E/maxresdefault.jpg",
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    price: 49900,
    modules: [
      {
        id: 1,
        title: "Introduction to React",
        lessons: [
          { id: 1, title: "What is React?", duration: "12:45", type: "video", completed: true },
          { id: 2, title: "Setting up your environment", duration: "18:30", type: "video", completed: true },
          { id: 3, title: "Your first React component", duration: "22:15", type: "video", completed: false },
          { id: 4, title: "Introduction exercises", duration: "PDF", type: "download", completed: false }
        ]
      },
      {
        id: 2,
        title: "React Fundamentals",
        lessons: [
          { id: 5, title: "JSX syntax", duration: "15:20", type: "video", completed: false },
          { id: 6, title: "Props and state", duration: "25:10", type: "video", completed: false },
          { id: 7, title: "Component lifecycle", duration: "19:45", type: "video", completed: false },
          { id: 8, title: "Fundamentals exercises", duration: "PDF", type: "download", completed: false }
        ]
      },
      {
        id: 3,
        title: "Building Real Applications",
        lessons: [
          { id: 9, title: "Creating a todo app", duration: "32:50", type: "video", completed: false },
          { id: 10, title: "Fetching data from APIs", duration: "28:15", type: "video", completed: false },
          { id: 11, title: "Final project overview", duration: "14:20", type: "video", completed: false },
          { id: 12, title: "Project resources", duration: "ZIP", type: "download", completed: false }
        ]
      }
    ],
    resources: [
      { id: 1, title: "React Cheat Sheet", type: "PDF", size: "2.4 MB", downloaded: true },
      { id: 2, title: "Starter Project Files", type: "ZIP", size: "5.1 MB", downloaded: false },
      { id: 3, title: "Additional Reading", type: "PDF", size: "1.8 MB", downloaded: false }
    ],
    whatYoullLearn: [
      "Fundamentals of React and JSX syntax",
      "State management and component lifecycle",
      "Building reusable components",
      "Working with forms and user input",
      "Fetching and displaying data from APIs",
      "React hooks and modern practices",
      "Performance optimization techniques",
      "Deploying React applications"
    ],
    requirements: [
      "Basic HTML, CSS, and JavaScript knowledge",
      "Node.js installed on your computer",
      "Code editor (VS Code recommended)"
    ]
  },
  2: {
    id: 2,
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts, design patterns, and modern ES6+ features.",
    instructor: "John Doe",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    duration: "8 weeks",
    level: "Advanced",
    rating: 4.9,
    students: 980,
    price: 69900,
    modules: [
      {
        id: 1,
        title: "Advanced ES6+ Features",
        lessons: [
          { id: 1, title: "Destructuring patterns", duration: "14:25", type: "video", completed: false },
          { id: 2, title: "Advanced promises", duration: "22:10", type: "video", completed: false },
          { id: 3, title: "Generators and iterators", duration: "18:45", type: "video", completed: false },
          { id: 4, title: "ES6+ exercises", duration: "PDF", type: "download", completed: false }
        ]
      },
      {
        id: 2,
        title: "Design Patterns",
        lessons: [
          { id: 5, title: "Module pattern", duration: "16:30", type: "video", completed: false },
          { id: 6, title: "Observer pattern", duration: "20:15", type: "video", completed: false },
          { id: 7, title: "Singleton pattern", duration: "12:50", type: "video", completed: false },
          { id: 8, title: "Patterns exercises", duration: "PDF", type: "download", completed: false }
        ]
      }
    ],
    resources: [
      { id: 1, title: "JavaScript Patterns Guide", type: "PDF", size: "3.2 MB", downloaded: false },
      { id: 2, title: "Code Examples", type: "ZIP", size: "4.7 MB", downloaded: false }
    ],
    whatYoullLearn: [
      "Advanced ES6+ features and syntax",
      "JavaScript design patterns",
      "Functional programming concepts",
      "Memory management and performance",
      "Asynchronous programming patterns",
      "Metaprogramming techniques"
    ],
    requirements: [
      "Solid understanding of JavaScript fundamentals",
      "Experience with basic programming concepts",
      "Familiarity with ES6 syntax"
    ]
  }
};

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses[id];
  const [expandedModules, setExpandedModules] = useState({});
  const [activeTab, setActiveTab] = useState("content");
  const [isFavorite, setIsFavorite] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h1 className="text-2xl font-bold text-gray-800">Course not found</h1>
            <p className="text-gray-600 mt-2">The requested course doesn't exist or is no longer available.</p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1">
              Browse Courses
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const calculateCompletion = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (lesson.completed) completedLessons++;
      });
    });
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-semibold rounded-full mb-3">
                      {course.level} Level
                    </span> */}
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white"
                  >
                    {course.title}
                  </motion.h1>
                </div>
                <div className="flex space-x-3">
                  {/* <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full ${isFavorite ? 'bg-pink-100 text-pink-600' : 'bg-white bg-opacity-20 text-white'}`}
                  >
                    <FiHeart className={`transition-colors ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full bg-white bg-opacity-20 text-white">
                    <FiShare2 />
                  </button> */}
                </div>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-lg text-white text-opacity-90"
              >
                {course.description}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex flex-wrap items-center gap-4"
              >
                <div className="flex items-center text-sm text-white text-opacity-90">
                  <FiClock className="mr-1.5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-sm text-white text-opacity-90">
                  <FiBarChart2 className="mr-1.5" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center text-sm text-white text-opacity-90">
                  <div className="flex items-center mr-1.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'fill-current text-yellow-400' : 'text-white text-opacity-70'}`}
                      />
                    ))}
                  </div>
                  <span>{course.rating} ({course.students.toLocaleString()} students)</span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center"
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-lg shadow-md">
                    {course.instructor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <div className="h-3 w-3 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white text-opacity-80">Created by</p>
                  <p className="text-white font-medium">{course.instructor}</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="md:w-1/3"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="inline-block px-2 py-1 bg-white text-blue-600 text-xs font-bold rounded">
                      BESTSELLER
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{(course.price / 100).toLocaleString()}</span>
                      {course.price > 100000 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">₹{((course.price * 1.2) / 100).toLocaleString()}</span>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Purchased
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                      <FiPlay className="mr-2" />
                      Start Learning
                    </button>
                    
                    <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300">
                      <FiDownload className="mr-2" />
                      Download Resources
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-600">
                    30-Day Money-Back Guarantee
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("content")}
              className={`px-6 py-4 font-medium text-sm border-b-2 ${activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium text-sm border-b-2 ${activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-6 py-4 font-medium text-sm border-b-2 ${activeTab === "resources" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Resources
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-6 py-4 font-medium text-sm border-b-2 ${activeTab === "announcements" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 font-medium text-sm border-b-2 ${activeTab === "reviews" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {activeTab === "content" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                  <div className="text-sm text-gray-600">
                    {course.modules.length} modules • {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} lessons
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                            {module.id}
                          </div>
                          <h3 className="font-medium text-gray-900 text-left">{module.title}</h3>
                        </div>
                        {expandedModules[module.id] ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedModules[module.id] && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="divide-y divide-gray-200"
                          >
                            {module.lessons.map((lesson) => (
                              <motion.li 
                                key={lesson.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="p-4 hover:bg-gray-50 transition-colors duration-150"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {lesson.type === 'video' ? (
                                      <div className={`relative mr-3 ${lesson.completed ? 'text-green-500' : 'text-blue-500'}`}>
                                        <FiPlay />
                                        {lesson.completed && (
                                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full flex items-center justify-center">
                                            <FiCheckCircle className="h-2 w-2 text-white" />
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <FiDownload className={`mr-3 ${lesson.completed ? 'text-green-500' : 'text-gray-500'}`} />
                                    )}
                                    <span className={`${lesson.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                </div>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Course Description */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About This Course</h3>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      This comprehensive course will take you from React basics to building complete applications. 
                      You'll learn through hands-on projects and real-world examples that you can add to your portfolio.
                    </p>
                    <p className="mt-4">
                      By the end of this course, you'll be able to build interactive web applications with React, 
                      understand component architecture, manage state effectively, and work with external APIs.
                    </p>
                  </div>
                </div>
                
                {/* What You'll Learn */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.whatYoullLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Requirements */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2 mr-3"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Instructor */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">About the Instructor</h3>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{course.instructor}</h4>
                      <p className="text-blue-600 text-sm mt-1">Senior Frontend Developer</p>
                      <p className="text-gray-600 mt-3">
                        With over 10 years of experience in web development, {course.instructor.split(' ')[0]} has worked with major tech companies 
                        and now focuses on teaching modern web technologies to aspiring developers.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span>4.8 Instructor Rating</span>
                        <span className="mx-2">•</span>
                        <FiAward className="text-blue-500 mr-1" />
                        <span>12 Courses</span>
                        <span className="mx-2">•</span>
                        <FiBook className="text-green-500 mr-1" />
                        <span>{course.students.toLocaleString()} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === "resources" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {course.resources.map((resource) => (
                    <div key={resource.id} className="border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg mr-4 ${resource.downloaded ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            <FiDownload />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{resource.title}</p>
                            <p className="text-sm text-gray-500">{resource.type} • {resource.size}</p>
                          </div>
                        </div>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${resource.downloaded ? 'bg-gray-100 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                          {resource.downloaded ? 'Downloaded' : 'Download'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Course Completion</span>
                    <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-xs text-gray-500 mt-1">Lessons Done</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1</div>
                    <div className="text-xs text-gray-500 mt-1">Modules Done</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-xs text-gray-500 mt-1">Resources</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    <FiPlay className="mr-2" />
                    Continue Learning
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Course Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">This Course Includes</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <FiPlay className="text-blue-500 mr-3" />
                  <span className="text-gray-700">12 hours on-demand video</span>
                </li>
                <li className="flex items-center">
                  <FiDownload className="text-green-500 mr-3" />
                  <span className="text-gray-700">8 downloadable resources</span>
                </li>
                <li className="flex items-center">
                  <FiClock className="text-purple-500 mr-3" />
                  <span className="text-gray-700">Full lifetime access</span>
                </li>
                <li className="flex items-center">
                  <FiBook className="text-yellow-500 mr-3" />
                  <span className="text-gray-700">Certificate of completion</span>
                </li>
              </ul>
            </motion.div>
            
            {/* Certificate Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Earn a Certificate</h3>
                <p className="text-sm text-indigo-100 mb-4">
                  Complete this course to receive a certificate that you can share with your professional network.
                </p>
                {/* <div className="relative h-40 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">Certificate</div>
                    <div className="text-xs opacity-80">of Completion</div>
                  </div>
                  <div className="absolute inset-0 border-2 border-dashed border-white border-opacity-30 m-2 rounded-lg"></div>
                </div> */}
                <button className="mt-4 w-full px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity">
                  View Sample
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;