"use client";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { formatDistanceToNow } from "date-fns";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import Button from "@mui/material/Button";
import { Avatar, Box, Chip, TextField, Typography } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import api_url from "@/config";
import { Post } from "@/interfaces";
import AddCommentModal from "@/components/AddComment";

export default function PostDetail() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comment, setComment] = useState("");
  const { postId } = useParams();
  const pathname = usePathname();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddComment, setOpenAddComment] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;
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

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in ");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const author = payload.username;
      const requestBody = {
        author,
        content: comment,
      };
      const response = await axios.post(
        `${api_url}/posts/${postId}/comments`,
        requestBody,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"token"}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Comment added!");
        setComment("");
        getPost();
      } else {
        alert("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const fetchSpecificId = async () => {
    try {
      const response = await axios.get(`${api_url}/posts/${postId}`);
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.error("Error Fectch Specific ID", e);
    }
  };
  const getPost = async () => {
    if (typeof postId !== "string") return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetchSpecificId();
      setPost(response);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (postId) {
      getPost();
    }

    return () => {
      setLoading(false);
      setError(null);
    };
  }, [postId]);

  if (!post) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row bg-white">
      {/* Left Sidebar (only visible on large screens) */}
      <div className="hidden lg:flex flex-col space-y-4 px-4 py-4 lg:px-10 lg:py-10 bg-grey100Custom lg:w-1/3 h-screen">
        <div
          onClick={() => router.push("/homepage")}
          className={`flex items-center cursor-pointer ${
            isActive("/homepage") ? "font-bold" : "font-extralight"
          }`}
        >
          <HomeOutlinedIcon sx={{ marginRight: "4px" }} />
          <span>Home</span>
        </div>
        <div
          onClick={() => {
            if (!user) {
              alert("User not logged in !!");
            } else {
              router.push("/homepage/ourblog");
            }
          }}
          className={`flex items-center cursor-pointer ${
            isActive("/homepage/ourblog") ? "font-bold" : "font-extralight"
          }`}
        >
          <NoteAltOutlinedIcon sx={{ marginRight: "4px" }} />
          <span>Our Blog</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6 lg:p-10 md:ml-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center bg-greenCustom100 text-gray-600 hover:text-gray-800 rounded-full p-2 md:p-3  transition mb-4"
        >
          <ArrowBackIcon />
        </button>

        {/* Post Details */}
        <div className="bg-white p-4 md:p-6 lg:p-10 rounded-lg ">
          <div className="flex items-center mb-4">
            <Avatar
              src={post.avatar}
              alt={post.name}
              className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4"
            />
            <Typography variant="h6" className="text-gray-500">
              {post.name}
            </Typography>
            <span className="text-gray-500 text-sm mx-4">
              {formatDistanceToNow(new Date(post.timestamp), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Post Content */}
          <Chip
            label={post.category}
            size="small"
            className="mb-4 bg-gray-200 text-xs md:text-sm"
          />
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{post.title}</h1>
          <p className="text-gray-700 mt-4 text-sm md:text-base">
            {post.description}
          </p>

          {/* Comments Section */}
          <div className="text-gray-600 mt-2 space-x-2 text-sm md:text-base">
            <ChatBubbleOutlineOutlinedIcon fontSize="small" />
            <span>{post.comments.length} Comments</span>
          </div>
          {!isLoggedIn ? (
            <Link href="/" passHref>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#49A569",
                  color: "#49A569",
                  "&:hover": {
                    backgroundColor: "rgba(73, 165, 105, 0.1)",
                    borderColor: "#49A569",
                  },
                }}
                className="mt-4 text-sm md:text-base"
              >
                Add Comments
              </Button>
            </Link>
          ) : (
            // Show Comment Form if log-in
            <>
              <Box
                mt={4}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="What's on your mind..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  size="medium"
                  rows={2}
                  variant="outlined"
                  sx={{
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
                      marginBottom: "8px",
                    },
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outlined"
                    onClick={() => setComment("")}
                    sx={{
                      borderColor: "#49A569",
                      color: "#49A569",
                      "&:hover": {
                        backgroundColor: "rgba(73, 165, 105, 0.1)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePostComment}
                    sx={{
                      bgcolor: "#49A569",
                      color: "#fff",
                      "&:hover": {
                        bgcolor: "#3b8c50",
                      },
                    }}
                  >
                    Post
                  </Button>
                </div>
              </Box>
              <Box
                sx={{
                  display: { xs: "flex", sm: "none" },
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => setOpenAddComment(true)}
                  sx={{
                    backgroundColor: "#49A569",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#66c58f",
                      borderColor: "#66c58f",
                    },
                  }}
                  className="text-sm md:text-base"
                >
                  Comments
                </Button>
              </Box>
            </>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-2 mt-4">
          {post.comments.map((comment) => (
            <div
              key={comment.commentId}
              className="p-4 rounded-lg shadow bg-white"
            >
              <div className="flex items-center mb-2">
                <Avatar
                  src="/avatar/placeholder.jpeg"
                  className="w-6 h-6 md:w-8 md:h-8 mr-2"
                />
                <span className="font-semibold text-sm md:text-base">
                  {comment.author}
                </span>
                <span className="text-gray-500 text-sm mx-4">
                  {formatDistanceToNow(new Date(comment.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm md:text-base">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
      <AddCommentModal
        open={openAddComment}
        handleClose={() => setOpenAddComment(false)}
        refetch={getPost}
      />
    </div>
  );
}
