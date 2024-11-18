import React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useRouter } from "next/navigation";
import api_url from "@/config";
import axios from "axios";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  width: {
    xs: "90%",
    sm: "400px",
  },
};

const AddCommentModal = ({
  open,
  handleClose,
  refetch,
}: {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
}) => {
  const [comment, setComment] = useState("");
  const { postId } = useParams();

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
        handleClose();
        refetch();
      } else {
        alert("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Add Comments
        </Typography>
        <TextField
          fullWidth
          placeholder="What's on your mind..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={3}
          variant="outlined"
          sx={{
            mb: 3,
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
        <Stack direction="column" spacing={2} justifyContent="center">
          <div
            className="absolute top-6 right-10 cursor-pointer"
            onClick={handleClose}
          >
            <CloseIcon sx={{ marginLeft: "auto" }} />
          </div>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: "#49A569",
              borderColor: "#49A569",
              ":hover": {
                backgroundColor: "#e0f2e9",
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
              ":hover": {
                bgcolor: "#3b8c50",
              },
            }}
          >
            Post
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddCommentModal;
