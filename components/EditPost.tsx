import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import api_url from "@/config";
import axios from "axios";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: 400,
    md: 600,
  },
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: {
    xs: 2,
    sm: 3,
    md: 4,
  },
};

interface BasicModalProps {
  open: boolean;
  handleClose: () => void;
  postId: number;
  refetchAllPost: () => void;
}

export default function EditPost({
  open,
  handleClose,
  postId,
  refetchAllPost,
}: BasicModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postData, setPostData] = useState({
    category: "",
    title: "",
    description: "",
  });

  const fetchSpecficPost = async () => {
    if (!postId) return;
    try {
      const response = await axios.get(`${api_url}/posts/${postId}`);
      setPostData(response.data);
      console.log("Fetched post data:", response.data);
    } catch (e) {
      console.error("Error fetching specific post:", e);
    }
  };
  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(`${api_url}/posts/${postId}`, {
        ...postData,
      });

      if (response.status === 200) {
        alert("Post updated successfully");
        handleClose();
        refetchAllPost();
      } else {
        alert("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post");
    }
  };

  // Use useEffect to fetch data when postId changes
  useEffect(() => {
    fetchSpecficPost();
  }, [postId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div
          className="absolute top-6 right-10 cursor-pointer"
          onClick={handleClose}
        >
          <CloseIcon sx={{ marginLeft: "auto" }} />
        </div>
        {/* Modal Header */}
        <Typography variant="h5" className="font-bold mb-4">
          Edit Post
        </Typography>

        {/* Dropdown */}
        <FormControl
          size="small"
          className="mb-4"
          sx={{
            "& .MuiInputLabel-root": {
              color: "#49A569",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#49A569",
                borderRadius: "10px",
              },
              "&:hover fieldset": {
                borderColor: "#3b8c50",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#49A569",
              },
            },
            minWidth: "200px",
          }}
        >
          <InputLabel
            sx={{
              fontSize: "12px",
            }}
          >
            Choose a community
          </InputLabel>
          <Select
            value={postData?.category || ""}
            onChange={(e) =>
              setPostData({ ...postData, category: e.target.value })
            }
            label="Choose a community"
          >
            <MenuItem value="">Select a category</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Exercise">Exercise</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Health">Health</MenuItem>
            <MenuItem value="Fashion">Fashion</MenuItem>
          </Select>
        </FormControl>

        {/* Title Input */}
        <TextField
          fullWidth
          label="Title"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          variant="outlined"
          className="mb-4"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

        {/* Description Input */}
        <TextField
          fullWidth
          label="What's on your mind..."
          variant="outlined"
          value={postData.description}
          onChange={(e) =>
            setPostData({ ...postData, description: e.target.value })
          }
          multiline
          rows={4}
          className="mb-6"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={handleClose}
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
            onClick={handleUpdatePost}
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
        </Box>
      </Box>
    </Modal>
  );
}
