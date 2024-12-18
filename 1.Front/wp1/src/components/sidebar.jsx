import React, { useState } from "react";
import { MenuBook, ArrowForwardIos } from "@mui/icons-material";

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedSubIndex, setSelectedSubIndex] = useState(null);

  const menuItems = [
    { name: "1-1", subItems: ["물리", "수학", "과학"] },
    { name: "1-2", subItems: ["물리", "수학", "과학"] },
    { name: "2-1", subItems: ["물리", "수학", "과학"] },
    { name: "2-2", subItems: ["물리", "수학", "과학"] },
    { name: "3-1", subItems: ["물리", "수학", "과학"] },
    { name: "3-2", subItems: ["물리", "수학", "과학"] },
    { name: "4-1", subItems: ["물리", "수학", "과학"] },
    { name: "4-2", subItems: ["물리", "수학", "과학"] },
  ];

  const colorMap = [
    "border-red-500",
    "border-orange-500",
    "border-yellow-500",
    "border-green-500",
    "border-blue-500",
    "border-indigo-500",
    "border-purple-500",
    "border-black",
  ];

  const handleMenuClick = (index) => {
    setActiveIndex(index);
    setOpenIndex(openIndex === index ? null : index);
    setSelectedSubIndex(null); // Reset sub-item selection when a new menu is selected
  };

  const handleSubItemClick = (index) => {
    setSelectedSubIndex(index); // Set the selected sub-item index
  };

  return (
    <aside className="group/sidebar flex flex-col shrink-0 lg:w-[300px] w-[250px] transition-all duration-300 ease-in-out m-0 fixed z-40 inset-y-0 left-0 bg-white border-r border-r-dashed border-r-neutral-200">
      {/* Header */}
      <div className="flex shrink-0 px-8 items-center justify-between h-[96px]">
        <a
          className="transition-colors duration-200 ease-in-out flex items-center"
          href="#"
        >
          <MenuBook
            className="text-gray-600 hover:text-blue-600"
            style={{ fontSize: "2rem" }}
          />
          <span className="ml-4 font-medium text-gray-800">나의 학습</span>
        </a>
      </div>

      {/* Divider */}
      <div className="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200"></div>

      {/* Menu */}
      <div className="relative pl-3 my-5 overflow-y-scroll">
        <div className="flex flex-col w-full font-medium">
          {menuItems.map((menuItem, index) => (
            <div key={index} className="flex flex-col">
              <div
                className={`select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem] hover:bg-gray-100 transition-colors duration-200 ${
                  activeIndex === index ? `border-l-4 ${colorMap[index]}` : ""
                }`}
                onClick={() => handleMenuClick(index)}
              >
                <a
                  href="#"
                  className={`flex items-center flex-grow text-[1.15rem] font-medium ${
                    activeIndex === index
                      ? "text-secondary-inverse"
                      : "dark:text-neutral-400/75 text-stone-500"
                  }`}
                >
                  {menuItem.name}
                </a>
              </div>

              {/* Dropdown */}
              {openIndex === index && menuItem.subItems && (
                <div className="ml-8 mt-2 space-y-2">
                  {menuItem.subItems.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={`relative flex items-center pl-10 pr-4 py-[.6rem] cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                        activeIndex === index && selectedSubIndex === subIndex
                          ? `border-l-8 ${colorMap[index]}`
                          : "border-l-8 border-transparent"
                      }`}
                      onClick={() => handleSubItemClick(subIndex)}
                    >
                      {selectedSubIndex === subIndex && (
                        <ArrowForwardIos
                          style={{
                            fontSize: "16px",
                            position: "absolute",
                            left: "-30px",
                            color: "gray",
                          }}
                        />
                      )}
                      <span className="text-[1rem] text-gray-600">{subItem}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
        </div>
      </div>
      {/* User Info */}
      <div className="flex items-center justify-between px-8 py-3">
            <div className="flex items-center mr-5">
              <div className="mr-5">
                <img
                  className="w-[40px] h-[40px] shrink-0 inline-block rounded-[.95rem]"
                  src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                  alt="avatar"
                />
              </div>
              <div className="mr-2">
                <a
                  href="#"
                  className={`dark:hover:text-primary hover:text-primary transition-colors duration-200 ease-in-out text-[1.075rem] font-medium text-gray-600`}
                >
                  <span className="hidden sm:inline">Robert </span>
                  Jason
                </a>
                <span className="text-gray-600 font-medium block text-[0.85rem]">
                  University
                </span>
              </div>
            </div>
            <a
              className="inline-flex relative items-center group justify-end text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-[.95rem] transition-colors duration-150 ease-in-out text-dark bg-transparent shadow-none border-0"
              href="#"
            >
              <span className="leading-none transition-colors duration-200 ease-in-out peer shrink-0 group-hover:text-primary text-secondary-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </span>
            </a>
          </div>
    </aside>
  );
};

export default Sidebar;
