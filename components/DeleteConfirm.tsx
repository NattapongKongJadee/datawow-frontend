import React, { useEffect } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import { log } from "node:console";
import axios from "axios";
import api_url from "@/config";

interface DeleteConfirmProps {
  open: boolean;
  postId: number;
  handleClose: () => void;
  refetchAllPost: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  open,
  handleClose,
  postId,
  refetchAllPost,
}) => {
  const handleDeletePost = async () => {
    if (!postId) return;
    try {
      const response = await axios.delete(`${api_url}/posts/${postId}`);
      if (response.status === 200) {
        alert("Delete success");
        refetchAllPost();
      }
    } catch (e) {
      console.error("Error to delete : ", e);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Please confirm if you wish to delete the post
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mb: 4 }}
        >
          Are you sure you want to delete the post? Once deleted, it cannot be
          recovered.
        </Typography>
        <div className="flex justify-center space-x-4">
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              minWidth: "150px",
              borderRadius: "8px",
              color: "grey.500",
              borderColor: "grey.500",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeletePost}
            sx={{ minWidth: "150px", borderRadius: "8px" }}
          >
            Delete
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteConfirm;
