
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";


const Navbar = async () => {

    const {isAuthenticated} = getKindeServerSession();
    const isAuth = await isAuthenticated();

    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-20 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href={"/"} className="flex z-40 font-semibold text-lg">
                        <span>quill.</span>
                    </Link>
                    <div className="hidden items-center space-x-4 sm:flex">
                        <>
                            <Link className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm'
                            })} href={'/pricing'}>
                                Pricing
                            </Link>
                            { !isAuth ? 
                                (<>
                                <LoginLink  className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm'
                                })}>
                                    Sign in
                                </LoginLink>
                                <RegisterLink className={buttonVariants({
                                    size: 'sm'
                                })}>
                                    Get started <ArrowRight className="w-5 h-5 ml-1.5" />
                                </RegisterLink>  
                                </>) : (<Link className={buttonVariants({
                                        variant: 'default',
                                        size: 'sm'
                                        })} href={'/dashboard'}>
                                    Dashboard
                                </Link>)
                            }
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar;