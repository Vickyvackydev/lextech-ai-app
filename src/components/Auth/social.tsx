'use client';

import {FcGoogle} from 'react-icons/fc'
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routeStrategy';
import { useState } from 'react';


export const Social =() => {


    const [show, setShow] = useState(false)
    const onClick = (provider: "google" | "github") => {
        signIn(provider,{
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }
    return (
        <div className="flex items-center w-full gap-x-2">
            {show && <Button
            size={"lg"}
            className='w-full'
            variant={"outline"}
            onClick={() => onClick("google")}>
                <FcGoogle className='h-5 w-5' />
            </Button>}

 
        </div>
    )
}