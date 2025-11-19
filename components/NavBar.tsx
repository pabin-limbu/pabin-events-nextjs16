import React from 'react'
import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
    return (
        <header>
            <nav>
                <Link href={"/"} className={"logo"}>
                    <Image src={"/icons/logo.png"} alt={"logo"} width={24} height={24}/>
                    <p>dev event</p>

                </Link>

                <ul>
                    <Link href={'/'}>home</Link>
                    <Link href={'/'}>Event</Link>
                    <Link href={'/'}>Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}
export default NavBar
