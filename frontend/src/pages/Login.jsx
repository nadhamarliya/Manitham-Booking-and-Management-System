import LoginLeftSide from "../components/LoginLeftSide";
// Change this line to explicitly add the .jsx extension at the end:
import LoginForm from "../components/LoginForm.jsx"; 

const Login = () => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <LoginLeftSide />
      
      {/* Centering wrapper */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white h-screen">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
