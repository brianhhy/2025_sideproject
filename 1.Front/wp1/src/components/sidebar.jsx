import React, { useState } from "react";
import { MenuBook, Settings } from "@mui/icons-material";

const Sidebar = ({ contents, onMenuItemClick, onContentLoad }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { name: "1-1", subItems: ["물리", "수학", "과학"] },
    { name: "1-2", subItems: ["국어", "영어", "화학"] },
    { name: "2-1", subItems: ["체육", "생명과학", "일본어"] },
    { name: "2-2", subItems: ["물리", "수학", "중국어"] },
    { name: "3-1", subItems: ["물리", "수학", "영어"] },
    { name: "3-2", subItems: ["물리", "수학", "지구과학"] },
    { name: "4-1", subItems: ["물리", "수학", "생명과학"] },
    { name: "4-2", subItems: ["물리", "수학", "정보"] },
  ];

  const handleMenuClick = (index) => {
    setActiveIndex(index);
    setOpenIndex((prevOpenIndex) => (prevOpenIndex === index ? null : index));

    if (onMenuItemClick) {
      onMenuItemClick(menuItems[index].name, menuItems[index].subItems);
    }

    if (onContentLoad) {
      onContentLoad(
        <div className="flex flex-wrap items-center justify-center w-full h-full gap-4 p-4">
          {menuItems[index].subItems.map((subItem, subIndex) => (
            <div
              key={subIndex}
              className="w-[200px] h-[300px] border border-gray-300 rounded-lg shadow-md flex flex-col items-center relative"
            >
              <div className="absolute top-0 left-0 w-8 h-full bg-red-500 rounded-l-lg"></div>
              <div className="flex flex-col justify-center items-center w-full h-full">
                <span className="text-lg font-bold text-gray-800 mt-2">{subItem}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getMenuItemBorderColor = (index) => {
    const colors = ["border-red-500", "border-orange-500", "border-yellow-500", "border-green-500", "border-blue-500", "border-indigo-500", "border-purple-500", "border-black"];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col h-screen">
      <aside className="group/sidebar flex flex-col shrink-0 lg:w-[300px] w-[250px] transition-all duration-300 ease-in-out m-0 fixed z-40 inset-y-0 left-0 bg-white border-r border-r-dashed border-r-neutral-200">
        {/* Header */}
        <div className="flex shrink-0 px-8 items-center justify-between h-[96px]">
          <div className="transition-colors duration-200 ease-in-out flex items-center cursor-pointer">
            <MenuBook
              className="text-gray-600 hover:text-blue-600"
              style={{ fontSize: "2rem" }}
            />
            <span className="ml-4 font-medium text-gray-800" onClick={() => window.location.href = '/memo'}> 나의 학습 </span>

          </div>
        </div>

        {/* Divider */}
        <div className="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200"></div>

        {/* Menu */}
        <div className="relative pl-3 my-5 overflow-y-auto flex-1">
          <div className="flex flex-col w-full font-medium">
            {menuItems.map((menuItem, index) => (
              <div
                key={index}
                className="flex flex-col cursor-pointer"
              >
                <div
                  className={`select-none flex items-center px-4 py-[.775rem] my-[.4rem] rounded-[.95rem] hover:bg-gray-100 transition-colors duration-200 ${
                    activeIndex === index ? `border-l-4 ${getMenuItemBorderColor(index)}` : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(index);
                  }}
                >
                  <span
                    className={`flex items-center flex-grow text-[1.15rem] font-medium ${
                      activeIndex === index
                        ? "text-secondary-inverse"
                        : "dark:text-neutral-400/75 text-stone-500"
                    }`}
                  >
                    {menuItem.name}
                  </span>
                </div>
                {openIndex === index && (
                  <div className="ml-8 mt-2 flex flex-col">
                    {menuItem.subItems.map((subItem, subIndex) => (
                      <div key={subIndex} className="py-1 text-gray-700">
                        {subItem}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* User Info */}
        <div className="flex items-center justify-between px-8 py-3 bg-white w-full border-t border-neutral-200">
          <div className="flex items-center mr-5">
            <div className="mr-5">
              <img
                className="w-[40px] h-[40px] shrink-0 inline-block rounded-[.95rem]"
                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                alt="avatar"
              />
            </div>
            <div className="mr-2">
              <span
                className={`dark:hover:text-primary hover:text-primary transition-colors duration-200 ease-in-out text-[1.075rem] font-medium text-gray-600 cursor-pointer`}
              >
                Robert Jason
              </span>
              <span className="text-gray-600 font-medium block text-[0.85rem]">
                University
              </span>
            </div>
          </div>
          <button
            className="inline-flex relative items-center group justify-end text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-[.95rem] transition-colors duration-150 ease-in-out text-dark bg-transparent shadow-none border-0"
            onClick={toggleModal}
          >
            <Settings
              style={{ fontSize: "24px", color: "gray" }}
              className="group-hover:text-primary"
            />
          </button>
        </div>
      </aside>



      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Modal Title</h2>
            <p className="mb-4">This is a modal content.</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
