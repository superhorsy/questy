"use client"
import Login from "@components/Auth/Login";
import Registration from "@components/Auth/Registration";
import { useSearchParams } from 'next/navigation'
const Auth = () => {
    const searchParams = useSearchParams()
    const signup = searchParams.get('signup')
    if (!signup) {
        return <Login></Login>
    } else {
        return <Registration></Registration>
    }
}

export default Auth;
