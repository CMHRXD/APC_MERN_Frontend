import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AxiosClient from "../config/axios";
import useAuth from "../hooks/useAuth";
import usePacients from "../hooks/usePacients";
import useConsults from "../hooks/useConsults";
import useServices from "../hooks/useServices";
import useProducts from "../hooks/useProductos";
import useDates from "../hooks/useDates";



export default function Login() {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const { setAuth } = useAuth();

    const { getPacients } = usePacients();

    const { getConsults } = useConsults();

    const { getServices } = useServices();

    const { getProducts } = useProducts();

    const { getDates } = useDates();


    const handleSubmit = async (e) => {
        e.preventDefault();

        //Regular Expression for Email
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //Email Regex

        if ([email, password].includes("")) {// Check Empty fields
            setError(true);
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }
        if (!re.test(String(email).toLowerCase())) {//Check Email
            setError(true);
            setErrorMessage('Email invalido');
            return;
        }
        setError(false)
        try {
            const { data } = await AxiosClient.post("/doctors/login", { email, password })
            setAuth(data)
            getPacients()
                .then(()=>getDates())
                .then(() => getServices())
                .then(() => getProducts())
                .then(() => getConsults())
        } catch (error) {
            setError(true);
            setErrorMessage(error.response.data.msg);
            //console.log(error);
        }


    }
    return (
        <>
            <div className='w-full h-screen flex justify-center items-center'>
                <form method='POST' onSubmit={handleSubmit} className=' shadow-lg shadow-black rounded-lg p-8 w-full max-w-[600px] h-screen md:h-auto border-0'>
                    <div>
                        <h1 className='text-white text-4xl font-bold uppercase text-center pb-8'>Login</h1>
                    </div>

                    {error ? <p className="p-3 flex border-b border-red-500 text-red-500 mb-5"> {errorMessage} </p>
                        : null}

                    <div className='mb-5 border-b-2 flex border-blue-500'>
                        <input placeholder="Email" className="bg-transparent text-white focus:outline-none w-full p-2 text-lg font-semibold placeholder-white" type="email" autoComplete='true'
                            onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className='mb-5 border-b-2 flex border-blue-500'>
                        <input placeholder="Password" className="bg-transparent text-white focus:outline-none w-full p-2 text-lg font-semibold placeholder-white" type="password" autoComplete='true'
                            onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button className='bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white font-semibold px-4 py-3 mt-6 rounded-2xl w-full'>Acceder</button>

                    <div className='flex flex-col md:flex-row justify-between font-semibold  pt-8'>
                        <Link to="/signUp" className="block my-3 text-white">¿No tienes una Cuenta? Registrate</Link>
                        <Link to="/passwordForgot" className="block my-3 text-white">Olvide mi Password</Link>
                    </div>
                </form>
            </div>
        </>
    )
}
