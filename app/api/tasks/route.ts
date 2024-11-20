import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/utils/connect";
export async function POST(req: Request) {
   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ error: "Unauthorized", status: 401 });
      }
      const { title, description, date, completed, important } = await req.json();
      if (!title || !description || !date) {
         return NextResponse.json({
            error: "Missing required fields",
            status: 400,
         });
      }
      if (title.length < 3) {
         return NextResponse.json({
            error: "Title must be at least 3 characters long",
            status: 400,
         });
      }
      const task = await prisma.task.create({
         data: {
           title,
           description,
           date,
           isCompleted: completed,
           isImportant: important,
           userId,
         },
       });
   
      return NextResponse.json(task);
   } catch (error) {
      console.log("ERROR CREATING TASK: ", error);
      return NextResponse.json({ error: "Error creating task", status: 500 });
   }
}

export async function GET(req: Request) {
   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ error: "Unauthorized", status: 401 });
      }

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1", 10); // Trang hiện tại
      const limit = parseInt(searchParams.get("limit") || "2", 10); // Số nhiệm vụ mỗi trang

      const skip = (page - 1) * limit; // Bỏ qua số lượng nhiệm vụ ở các trang trước

      // Lấy danh sách nhiệm vụ với phân trang
      const tasks = await prisma.task.findMany({
         where: {
            userId,
         },
         skip: skip,
         take: limit,
         orderBy: {
            date: "desc", // Sắp xếp theo ngày giảm dần
         },
      });

      // Đếm tổng số nhiệm vụ để tính tổng số trang
      const totalTasks = await prisma.task.count({
         where: {
            userId,
         },
      });

      const totalPages = Math.ceil(totalTasks / limit);

      return NextResponse.json({
         tasks,
         page,
         totalPages,
         totalTasks,
      });
   } catch (error) {
      console.log("ERROR GETTING TASKS: ", error);
      return NextResponse.json({ error: "Error getting tasks", status: 500 });
   }
}


export async function PUT(req: Request) {
   try {
      const { userId } = await auth();
      const { isCompleted, id } = await req.json();

      if (!userId) {
         return NextResponse.json({ error: "Unauthorized", status: 401 });
      }
      const task = await prisma.task.update({
         where: {
           id,
         },
         data: {
           isCompleted,
         },
       });
       return NextResponse.json(task);
   } catch (error) {
     console.log("ERROR UPDATING TASK: ", error);
     return NextResponse.json({ error: "Error deleting task", status: 500 });
   }
 }