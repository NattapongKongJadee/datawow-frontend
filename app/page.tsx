"use client";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import api_url from "../config";

export default function Home() {
  const [username, setUsername] = useState("");
  const handleLogin = async () => {
    try {
      const response = await fetch(`${api_url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        alert("Login Failed! Please check your username and try again.");
        return;
      }

      const { accessToken } = await response.json();

      localStorage.setItem("token", accessToken);

      router.push("/homepage");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };
  const router = useRouter();
  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen bg-greenCustom500">
      <div className="order-1 lg:order-2 flex flex-col justify-center items-center w-full h-[50vh] bg-greenCustom300 lg:w-1/3 lg:h-full rounded-b-3xl lg:rounded-l-3xl lg:rounded-br-none p-4">
        <Link href="/homepage" passHref>
          <Image
            src="/logo-login.png"
            width={300}
            height={300}
            alt="login-image"
            className="mb-4"
          />
        </Link>
        <div className="text-3xl font-serif italic text-white">a Board</div>
      </div>

      <div className="order-2 lg:order-1 flex flex-col justify-center items-center w-full text-white lg:w-2/3 md:2/3  p-4">
        <div
          id="comp-sign-in"
          className="flex flex-col items-center w-full max-w-xs lg:max-w-lg "
        >
          <div className="my-8 font-extrabold text-3xl self-start">Sign In</div>
          <TextField
            id="username-log-in"
            placeholder="Username"
            type="text"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            sx={{
              width: "100%",
              bgcolor: "white",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
          <Button
            variant="contained"
            sx={{
              width: "100%",
              borderRadius: "8px",
              bgcolor: "#49A569",
              fontWeight: "bold",
            }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
