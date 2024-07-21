"use client";

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { auth as authFB } from "@/firebase";
import Loading from "@/components/loading";
import axios from "axios";
import { Nav } from "@/components/nav";
import { RootContext } from "@/context";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<any>(null)
  const [load, setLoad] = useState<boolean>(true)

  const router = useRouter();

  useEffect(() => {
    const auth = authFB;
    const listen = onAuthStateChanged(auth, (user_) => {
      if (user_) {

        setLoad(true);
        // console.log("USER", user_?.email);
        axios.post('/api/get-user', { email: user_?.email }).then((data: any) => {

          if (data?.data) {
            setUser(data?.data)
            if (window.location.href === "/") {
              router.refresh();
            }
            // console.log("AUhj")
            setLoad(false)
          } else {
            // console.log(data)
            router.refresh();
            setLoad(false);
          }

        }).catch((error) => {
          throw new Error(error);
          auth.signOut()
          setLoad(false);
        })
      } else {
        setUser(null);
        // console.log("no user got yet")
        router.push("/");
      }
    })
  }, [])


  return (
    <RootContext.Provider value={{
      user: [user, setUser],
      load: [load, setLoad]
    }}>
      <html lang="en">
        <Analytics />
        <Toaster/>
        <SpeedInsights/>
        <head>
          <title>vivaan chess | the new standard of chess</title>
          <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml"/>
          <meta name="robots" content="index"/>
          <meta name="google-site-verification" content="1R5UZJrtxamkK8ZPdUhvvOXCBsq1gjISmGTea768Tus" />
          <meta name="description" content="play, learn, rank, and more - 1v1 your friends with a link, rank up, play bots, learn strategies, do puzzles, analyze games and moves for free and a lot more in vivaan chess."/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9843003544372146"
     crossOrigin="anonymous"></script>
          <meta property="og:title" content="vivaan chess | the new standard of chess"/>
        </head>
        <body>

          {load && <Loading />}
          <div className="w-screen h-screen overflow-hidden flex flex-grow-[1] bg-slate-700">


            {user && <Nav />}
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </body>
      </html>
    </RootContext.Provider>
  );
}
