'use client'

import { useEffect, useState } from "react" 
import {getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const useGetUser = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<KindeUser | null>();
    const {getUser} = getKindeServerSession();

    useEffect(() => {
        const getAuthUser = async () => {
            try {
                setLoading(true);
                const user = await getUser();
                setUser(user);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        getAuthUser();
    }, [getUser])

    return {loading, user}
}

export default useGetUser;