'use client';


import Image from "next/image"
import styles from "./navbar.module.css"
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { User } from "firebase/auth";
import SignIn from "./sign-in";
import Upload from "./upload";



export default function NavBar() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
        setUser(user);
        });
        return () => unsubscribe();
    }, [] );


    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                src="/youtube-logo.svg" alt="YouTube Logo"/>
            </Link>
            {
                user && <Upload />
            }
            <SignIn user={user} />
        </nav>
    );

}

