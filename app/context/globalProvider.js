'use client'

import React, {createContext, useState, useContext} from "react"
import themes from "./themes";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
export const GlobalContext = createContext()
export const GlobalUpdateContext = createContext()

export const GlobalProvider = ({children}) =>{
   const { user } = useUser();
   // console.log("user", user)
   const [selectedTheme, setSelectedTheme] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   const [modal, setModal] = useState(false);
   const [collapsed, setCollapsed] = useState(false);
   const [searchQuery, setSearchQuery] = useState(""); // Thêm state cho từ khóa tìm kiếm
   const [tasks, setTasks] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const theme = themes[selectedTheme];
   const openModal = () => {
      setModal(true);
    };
    const toggleTheme = () => {
      setSelectedTheme((prev) => (prev === 0 ? 1 : 0));
    };
   const closeModal = () => {
      setModal(false);
   };
   const collapseMenu = () => {
      setCollapsed(!collapsed);
    };
   const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
   );
   // console.log("Search Query:", searchQuery); // Log từ khóa tìm kiếm
   // console.log("Filtered Tasks:", filteredTasks); // Log danh sách nhiệm vụ được lọc
   const allTasks = async (page = 1, limit = 20) => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/tasks?page=${page}&limit=${limit}&search=${searchQuery}`);
        console.log("API Response with Pagination:", res.data);
        const { tasks, totalPages } = res.data;
      //   const sorted = res.data.sort((a, b) => {
      //     return (
      //       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      //     );
      //   });
  
        setTasks(tasks);
        setTotalPages(totalPages); // Lưu tổng số trang vào state
        setCurrentPage(page); // Cập nhật trang hiện tại
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    const deleteTask = async (id) => {
      try {
        const res = await axios.delete(`/api/tasks/${id}`);
        toast.success("Task deleted");
  
        allTasks();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };
   const updateTask = async (task) => {
      try {
         const res = await axios.put(`/api/tasks`, task);

         toast.success("Task updated");

         allTasks();
      } catch (error) {
         console.log(error);
         toast.error("Something went wrong");
      }
   };
  
   React.useEffect(() => {
      if (user) allTasks(currentPage);
    }, [user,searchQuery, currentPage]);
   const completedTasks = tasks.filter((task) => task.isCompleted === true);
   const importantTasks = tasks.filter((task) => task.isImportant === true);
   const incompleteTasks = tasks.filter((task) => task.isCompleted === false);
   return (
      <GlobalContext.Provider
         value={{
            theme,
            toggleTheme,
            isLoading,
            tasks,
            allTasks,
            currentPage, 
            totalPages,
            deleteTask,
            updateTask,
            completedTasks,
            importantTasks,
            incompleteTasks,
            modal,
            openModal,
            closeModal,
            collapsed,
            collapseMenu,
            filteredTasks, // Thêm danh sách được lọc
            setSearchQuery, // Hàm để cập nhật từ khóa tìm kiếm
           
         }}
      >
         <GlobalUpdateContext.Provider value={{}}>
            {children}
         </GlobalUpdateContext.Provider>
      </GlobalContext.Provider>
   )
}

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);