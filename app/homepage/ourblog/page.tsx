"use client";
import React, { useEffect, useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MainCard from "@/components/MainCard";
import CreatePost from "@/components/CreatePost";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Post } from "@/interfaces";
import api_url from "@/config";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>();

  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const isActive = (path: string) => pathname === path;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangeCategory = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const token = localStorage.getItem("token");
  if (!token) {
    alert("User not logged in ");
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const author = payload?.username;

  const fetchAllPost = async () => {
    const response = await axios.get(`${api_url}/posts`);
    console.log(response.data);
    setPosts(response.data);
  };

  useEffect(() => {
    fetchAllPost();
  }, []);
  useEffect(() => {
    if (!posts) return;

    const filtered = posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);
  return (
    <div className="flex flex-row min-h-screen items-start justify-start px-4 py-4 lg:px-10 lg:py-10 overflow-y-auto">
      {/* Left Section - Icons (Visible on md and larger screens only) */}
      <div className="hidden lg:flex flex-col shrink-0 space-y-4 w-full lg:w-auto">
        {/* Home Link */}
        <div
          onClick={() => router.push("/homepage")}
          className={`flex items-center cursor-pointer ${
            isActive("/homepage") ? "font-bold" : "font-extralight"
          }`}
        >
          <HomeOutlinedIcon sx={{ marginRight: "4px" }} />
          <span>Home</span>
        </div>

        {/* Our Blog Link */}
        <div
          onClick={() => router.push("/homepage/ourblog")}
          className={`flex items-center cursor-pointer ${
            isActive("/homepage/ourblog") ? "font-bold" : "font-extralight"
          }`}
        >
          <NoteAltOutlinedIcon sx={{ marginRight: "4px" }} />
          <span>Our Blog</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-center mb-6 items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Center Section - Search, Dropdown, and Button */}
        <div className="flex flex-col w-full lg:max-w-[60vw]">
          <div className="flex flex-col lg:flex-row items-center mx-auto   space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:max-w-[65vw]   p-4 rounded-lg ">
            {/* Search Field */}
            <TextField
              id="username-log-in"
              placeholder="Search"
              type="text"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              sx={{
                borderRadius: "20px",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": {
                    borderColor: "#49A569",
                  },
                  "&:hover fieldset": {
                    borderColor: "#3b8c50",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#49A569",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Dropdown Menu */}
            <FormControl
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", lg: "200px" }, flexShrink: 0 }}
            >
              <InputLabel>Community</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleChangeCategory}
                label="Community"
                sx={{
                  borderRadius: "20px",
                  ".MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: "10px", // Custom border radius for the dropdown menu
                    },
                  },
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Pets">Pets</MenuItem>
                <MenuItem value="Health">Health</MenuItem>
                <MenuItem value="Fashion">Fashion</MenuItem>
                <MenuItem value="Exercise">Exercise</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>

            {/* Create Button */}
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                bgcolor: "#49A569",
                fontWeight: "regular",
                minWidth: { xs: "100%", lg: "120px" }, // 100% on smaller screens, 120px on large screens
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Create
              <AddIcon sx={{ marginLeft: "4px", fontSize: "16px" }} />
            </Button>

            {/* Create Post Modal */}
            <CreatePost
              open={open}
              handleClose={handleClose}
              refetchPost={fetchAllPost}
            />
          </div>

          {/* PostCard Section - Stack on smaller screens */}
          {filteredPosts && (
            <div className="flex-grow w-full space-y-1  mx-auto p-4">
              {filteredPosts?.length > 0 ? (
                filteredPosts
                  .filter((post: any) => post.name === author)
                  .map((post: any) => (
                    <MainCard
                      key={post.postId}
                      {...post}
                      refetchAllPost={fetchAllPost}
                    />
                  ))
              ) : (
                <p>No posts available....</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default HomePage;
