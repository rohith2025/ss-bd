import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";


import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import feesRoutes from "./routes/feesRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import holidayRoutes from "./routes/holidayRoutes.js";
import thesisRoutes from "./routes/thesisRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import activitiesRoutes from "./routes/activitiesRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import gradesRoutes from "./routes/gradesRoutes.js";
import examHeadRoutes from "./routes/examHeadRoutes.js";
import hodRoutes from "./routes/hodRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feesRoutes); 
app.use("/api/notifications", notificationRoutes); 
app.use("/api/notices", noticeRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/thesis", thesisRoutes);
app.use("/api/transactions", transactionRoutes); // to be changed 
app.use("/api/activities", activitiesRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/exam-head", examHeadRoutes);
app.use("/api/hod", hodRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)