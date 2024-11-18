import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import api_url from "@/config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "400px", md: "500px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: "10px",
};

const theme = createTheme();
export default function CreatePostModal({
  open,
  handleClose,
  refetchPost,
}: any) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !selectedCategory) {
      alert("Please fill in all the required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return alert("User not  authenticated");
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username = payload.username;
    const postData = {
      name: username,
      category: selectedCategory,
      title,
      description,
    };

    try {
      const response = await axios.post(`${api_url}/posts`, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert("Post created successfully!");
        handleClose();
        refetchPost();
        setSelectedCategory("");
        setTitle("");
        setDescription("");
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post.");
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex cursor-pointer" onClick={handleClose}>
          <CloseIcon sx={{ marginLeft: "auto" }} />
        </div>
        <Typography
          variant="h5"
          className="font-bold mb-4"
          sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
        >
          Create Post
        </Typography>
        {/* Dropdown */}
        <FormControl
          size="small"
          className="mb-4"
          sx={{
            width: "100%",
            "& .MuiInputLabel-root": {
              color: "#49A569",
              fontSize: "14px",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#3b8c50",
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
          }}
        >
          <InputLabel>Choose a community</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Choose a community"
          >
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
          variant="outlined"
          className="mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiInputLabel-root": {
              color: "#49A569",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#3b8c50",
            },
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
        />

        {/* Description Input */}
        <TextField
          fullWidth
          label="What's on your mind..."
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-6"
          sx={{
            "& .MuiInputLabel-root": {
              color: "#49A569",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#3b8c50",
            },
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
        />

        {/* Action Buttons */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            fullWidth={isMobile}
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
            onClick={handleSubmit}
            fullWidth={isMobile}
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
