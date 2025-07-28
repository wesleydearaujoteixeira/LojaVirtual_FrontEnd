'use client'

import  Main  from "./components/Main";
import Header from "./components/Header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";

export default function Home() {


  const navigation = useRouter();


  useEffect(() => {
      const token = localStorage.getItem("token");

    if(!token) return navigation.push("/login");

  }, [])



  return (
    <div>
        <Header/>
        <Main/>
        <Footer/>
    </div>
  );
}
