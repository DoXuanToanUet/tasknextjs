'use client'
import Tasks from "./Components/Tasks/Tasks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useGlobalState } from "./context/globalProvider";
export default function Home() {
  // const { userId } = await auth();

  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  // if (!userId) {
  //   redirect("/sign-in"); // URL '/sign-in' phải khớp với route đăng nhập của bạn
  // }
  const { tasks, allTasks,currentPage,totalPages,totalTasks } = useGlobalState();
  const { filteredTasks, setSearchQuery } = useGlobalState(); // Lấy tasks được lọc và hàm setSearchQuery
  // console.log(tasks)
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    console.log("Search input:", query); // Log từ khóa nhập vào
    setSearchQuery(query);
  };
  const handlePageChange = (page: number) => {
    allTasks(page); // Gọi API với trang mới
  };
  // console.log("totalPages",totalPages)
  // console.log("totalPages",totalPages)
  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="border rounded px-3 py-1"
          onChange={handleSearch}
        />
      </div>
      {/* <Tasks title="All Tasks" tasks={filteredTasks} /> */}
      <Tasks title={`Tasks - Page ${currentPage}`} tasks={tasks} />
      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
