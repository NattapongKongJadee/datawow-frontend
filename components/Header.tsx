"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { ListItemButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.username || null;
    } catch (error) {
      console.error("Failed to parse token:", error);
      return null;
    }
  };
  const handleNavigation = () => {
    if (!user) {
      alert("User not logged in!");
    } else {
      router.push("/homepage/ourblog");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#243731" }}>
        <Toolbar>
          {/* Drawer for Mobile Menu */}
          <Drawer anchor="right" open={drawerOpen}>
            <Box
              sx={{
                width: 250,
                bgcolor: "#243731",
                color: "white",
                height: "100%",
              }}
              role="presentation"
            >
              <div
                className="flex p-8 cursor-pointer"
                onClick={() => setDrawerOpen(false)}
              >
                <ArrowForwardIcon fontSize="large" />
              </div>
              <List className="p-6">
                <Link href="/homepage" passHref>
                  <ListItemButton>
                    <HomeOutlinedIcon sx={{ marginRight: "6px" }} />
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </Link>
                <ListItemButton onClick={handleNavigation}>
                  <NoteAltOutlinedIcon sx={{ marginRight: "6px" }} />
                  <ListItemText primary="Our Blog" />
                </ListItemButton>
              </List>
            </Box>
          </Drawer>

          {/* "a Board" Text */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-2xl font-serif italic text-white md:mx-0">
              <Link href="/" onClick={handleLogout} passHref>
                a Board
              </Link>
            </div>

            <div className="flex items-center ml-auto">
              {/* Menu Icon Button - Only show on small screens */}
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  display: { xs: "flex", md: "none" },
                  mr: 2,
                  marginLeft: "auto",
                }}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </div>

          {!user && (
            <Button
              variant="contained"
              onClick={() => router.push("/")}
              sx={{
                marginLeft: "auto",
                bgcolor: "#49A569",
                fontWeight: "regular",
                minWidth: "90px",
                borderRadius: "8px",
                textTransform: "none",
                display: { xs: "none", md: "block" },
              }}
            >
              Sign In
            </Button>
          )}
          {user && (
            <div
              className=" hidden sm:flex ml-auto items-center hover:cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            >
              <span className="text-white mr-2">{user}</span>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-white font-bold">
                {user.charAt(0)}
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
