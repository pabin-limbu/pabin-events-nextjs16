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

                <ul className={"list-none"}>
                    <li>
                        <Link href={'/'}>Home</Link>
                    </li>
                    <li>
                        <Link href={'/'}>Event</Link>
                    </li>

                    <li>
                        <Link href={'/'}>Create Event</Link>
                    </li>

                </ul>
            </nav>
        </header>
    )
}
export default NavBar
