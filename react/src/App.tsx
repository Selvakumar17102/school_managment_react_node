import { BrowserRouter as Router, Routes, Route } from "react-router";


import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

import NotFound from "./pages/OtherPage/NotFound";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
// import Home from "./pages/Dashboard/Home";

import ProtectedRoute from "./routes/ProtectedRoute";
import SuperAdminDashboard from './pages/Dashboard/SuperAdminDashboard';
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import Calendar from "./pages/Calendar";
import UserProfiles from "./pages/UserProfiles";

import Student from "./pages/Student/Student";
import AddStudent from "./pages/Student/AddStudent";
import ViewStudent from "./pages/Student/ViewStudent";
import EditStudent from "./pages/Student/EditStudent";

import Parent from "./pages/Parent/Parent";
import AddParent from "./pages/Parent/AddParent";
import ViewParent from "./pages/Parent/ViewParent";
import EditParent from "./pages/Parent/EditParent";

import Teacher from "./pages/Teacher/Teacher";
import AddTeacher from "./pages/Teacher/AddTeacher";
import ViewTeacher from "./pages/Teacher/ViewTeacher";
import EditTeacher from "./pages/Teacher/EditTeacher";

import User from "./pages/User/User";
import AddUser from "./pages/User/AddUser";
import ViewUser from "./pages/User/ViewUser";
import EditUser from "./pages/User/EditUser";

import Classes from "./pages/Academic/Classes";
import AddClasses from "./pages/Academic/AddClasses";

import Section from "./pages/Academic/Section";
import AddSection from "./pages/Academic/AddSection";

import Subject from "./pages/Academic/Subject";
import AddSubject from "./pages/Academic/AddSubject";

import Syllabus from "./pages/Academic/Syllabus";
import AddSyllabus from "./pages/Academic/AddSyllabus";

import Assignment from "./pages/Academic/Assignment";
import AddAssignment from "./pages/Academic/AddAssignment";

import Routine from "./pages/Academic/Routine";
import AddRoutine from "./pages/Academic/AddRoutine";

import Sattendance from "./pages/Attendance/Sattendance";
import AddStudentAttendance from "./pages/Attendance/AddStudentAttendance";
import ViewSattendanceDetail from "./pages/Attendance/ViewSattendanceDetail";

import Tattendance from "./pages/Attendance/Tattendance";
import AddTeacherAttendance from "./pages/Attendance/AddTeacherAttendance";
import ViewTattendanceDetail from "./pages/Attendance/ViewTattendanceDetail";

import Uattendance from "./pages/Attendance/Uattendance";
import AddUserAttendance from "./pages/Attendance/AddUserAttendance";
import ViewUattendanceDetail from "./pages/Attendance/ViewUattendanceDetail";

import Exam from "./pages/Exam/Exam";
import AddExam from "./pages/Exam/AddExam";
import ExamSchedule from "./pages/Exam/ExamSchedule";
import AddExamSchedule from "./pages/Exam/AddExamSchedule";
import Grade from "./pages/Exam/Grade";
import AddGrade from "./pages/Exam/AddGrade";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>

          <Route index element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<AppLayout />}>
            <Route 
              path="/dashboard/superadmin"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/teacher"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/parent"
              element={
                <ProtectedRoute allowedRoles={["parent"]}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />

            {/* <Route path="/dashboard" element={<Home />} /> */}

            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />

            <Route path="/student" element={<Student />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/student/:id" element={<ViewStudent />} />
            <Route path="/editstudent/:id" element={<EditStudent />} />

            <Route path="/parent" element={<Parent />} />
            <Route path="/add-parent" element={<AddParent />} />
            <Route path="/viewparent/:id" element={<ViewParent />} />
            <Route path="/editparent/:id" element={<EditParent />} />

            <Route path="/teacher" element={<Teacher />} />
            <Route path="/add-teacher" element={<AddTeacher />} />
            <Route path="/viewteacher/:id" element={<ViewTeacher />} />
            <Route path="/editteacher/:id" element={<EditTeacher />} />

            <Route path="/user" element={<User />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/viewuser/:id" element={<ViewUser />} />
            <Route path="/edituser/:id" element={<EditUser />} />

            {/* Academic */}
            <Route path="/classes" element={<Classes />} />
            <Route path="/addClass" element={<AddClasses />} />
            <Route path="/editclass/:id" element={<AddClasses />} />

            <Route path="/section" element={<Section />} />
            <Route path="/addSection" element={<AddSection />} />
            <Route path="/editsection/:id" element={<AddSection />} />

            <Route path="/subject" element={<Subject />} />
            <Route path="/addSubject" element={<AddSubject />} />
            <Route path="/editsubject/:id" element={<AddSubject />} />
            
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/addSyllabus" element={<AddSyllabus />} />
            <Route path="/editsyllabus/:id" element={<AddSyllabus />} />

            <Route path="/assignment" element={<Assignment />} />
            <Route path="/addAssignment" element={<AddAssignment />} />
            <Route path="/editassignment/:id" element={<AddAssignment />} />


            <Route path="/routine" element={<Routine />} />
            <Route path="/addRoutine" element={<AddRoutine />} />


            <Route path="/sattendance" element={<Sattendance />} />
            <Route path="/addStudentAttendance" element={<AddStudentAttendance />} />
            <Route path="/viewStudentDetails/:id" element={<ViewSattendanceDetail />} />


            <Route path="/tattendance" element={<Tattendance />} />
            <Route path="/addTeacherAttendance" element={<AddTeacherAttendance />} />
            <Route path="/viewTeacherDetails/:id" element={<ViewTattendanceDetail />} />

            <Route path="/uattendance" element={<Uattendance />} />
            <Route path="/addUserAttendance" element={<AddUserAttendance />} />
            <Route path="/viewUserDetails/:id" element={<ViewUattendanceDetail />} />

            <Route path="/exam" element={<Exam />} />
            <Route path="/addExam" element={<AddExam />} />
            <Route path="/editexam/:id" element={<AddExam />} />
            
            <Route path="/examschedule" element={<ExamSchedule />} />
            <Route path="/addExamSchedule" element={<AddExamSchedule />} />
            <Route path="/editExamSchedule/:id" element={<AddExamSchedule isEditMode />} />
            
            <Route path="/grade" element={<Grade />} />
            <Route path="/addGrade" element={<AddGrade />} />
            <Route path="/editGrade/:id" element={<AddGrade />} />

            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
