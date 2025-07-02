// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// function Login() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState('');

//   const handleLogin = () => {
//     // Simulate login & set user data
//     const user = { role }; // ideally from backend
//     localStorage.setItem('user', JSON.stringify(user));

//     // Redirect based on role
//     switch (role) {
//       case 'superadmin':
//         navigate('/superadmin/dashboard');
//         break;
//       case 'admin':
//         navigate('/admin/dashboard');
//         break;
//       case 'teacher':
//         navigate('/teacher/dashboard');
//         break;
//       case 'student':
//         navigate('/student/dashboard');
//         break;
//       case 'parent':
//         navigate('/parent/dashboard');
//         break;
//       default:
//         alert('Invalid role selected');
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <select onChange={(e) => setRole(e.target.value)} defaultValue="">
//         <option value="" disabled>Select role</option>
//         <option value="superadmin">Superadmin</option>
//         <option value="admin">Admin</option>
//         <option value="teacher">Teacher</option>
//         <option value="student">Student</option>
//         <option value="parent">Parent</option>
//       </select>
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// export default Login;


// import PageMeta from "../../components/common/PageMeta";
// import AuthLayout from "./AuthPageLayout";
// import SignInForm from "../../components/auth/SignInForm";

// export default function SignIn() {
//   return (
//     <>
//       <PageMeta
//         title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
//         description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <AuthLayout>
//         <SignInForm />
//       </AuthLayout>
//     </>
//   );
// }
