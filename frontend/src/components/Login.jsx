import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMainContext } from "../context/MainContext"

function Login() {
    const { LogIn, loggedIn } = useMainContext()
    const navigate = useNavigate()
    const [name, setname] = useState("")
    const [password, setpassword] = useState("")

    useEffect(() => {
        if (loggedIn.logged) {
            navigate("/dashboard", { replace: true })
        }
    }, [loggedIn.logged])

    const SubmitLogin = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", name);
        formData.append("password", password);

        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.status === 201 || response.status === 200) {
                localStorage.setItem("emp", JSON.stringify(data.emp));
                LogIn(data.token)
                navigate("/dashboard");
            } else if (response.status === 401) {
                alert("Invalid Credentials");
            } else if (response.status === 400) {
                alert("Please enter username and password");
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="flex flex-col px-4 items-center justify-center w-full md:w-1/2  h-fvh h-full md:mt-8  ">
            <div className="mt-16 ">
                <h1 className=" text-3xl md:text-6xl font-bold text-center   ">CROB</h1>
                <h1 className=" uppercase font-sans text-center text-2xl md:text-4xl ">Crob Management Tool </h1>
                <form onSubmit={SubmitLogin} className="h-80 w-full border-2 mt-6 border-gray-300 rounded-xl flex flex-col  shadow-xl">
                    <h1 className=" ml-4 text-2xl mt-2  ">ID</h1>
                    <input placeholder="Enter Emplooye ID" type="text" id='name' value={name} onChange={(e) => setname(e.target.value)} className="border-2 border-slate-300 ml-4 rounded-lg w-11/12  mt-2 h-8 pl-4 items-center hover:opacity-80 "></input>
                    <h1 className="ml-4 text-2xl mt-4 "> Password</h1>
                    <input type="password" id="password" placeholder="Enter Password" value={password} onChange={(e) => setpassword(e.target.value)} className="border-2 border-slate-300  ml-4 rounded-lg w-11/12  mt-2 h-8 pl-4 items-center hover:opacity-80  "></input>
                    <button type="submit" className="border-2 border-slate-300 ml-4 rounded-lg w-11/12  mt-8 h-10 pl-4 items-center  bg-gray-800 text-white font-bold shadow-lg   hover:opacity-90  "> Sign In</button>
                    <a className="underline  ml-6    hover:opacity-80 "> Forgot Password?</a>
                </form>


            </div>
        </div>

    )
}
export default Login