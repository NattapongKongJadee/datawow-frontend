import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Chip,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import EditPost from "./EditPost";
import DeleteConfirm from "./DeleteConfirm";
import { usePathname, useRouter } from "next/navigation";
import { CardProps } from "@/interfaces";

const MainCard: React.FC<CardProps> = ({
  postId,
  name,
  category,
  title,
  description,
  comments,
  avatar,
  timestamp,
  refetchAllPost,
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);

  const pathname = usePathname();

  const isEditable = pathname === "/homepage/ourblog";

  const handleOpenEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPostId(id);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPostId(id);

    setOpenDelete(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Card className="flex flex-col lg:flex-row  p-2 xs:p-1  shadow-md rounded-lg bg-gray-50 hover:shadow-lg transition">
      {/* Card Content */}
      <CardContent className="flex flex-col    flex-grow cursor-pointer w-full lg:w-auto">
        <Link href={`/homepage/post/${postId}`} passHref>
          {/* Avatar */}
          <div className="flex items-center mb-4">
            <Avatar src={avatar} alt={name} className="w-10 h-10 mr-4" />
            <Typography variant="h6" className="text-gray-500">
              {name}
            </Typography>
          </div>
          <div className="flex flex-col items-start mb-1">
            <Chip label={category} size="small" className="p-1 mt-1 mb-2" />
            <Typography
              variant="h6"
              className="font-bold text-lg xs:text-base sm:text-lg md:text-xl"
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {description}
            </Typography>
            <div className="flex items-center space-x-2 text-gray-500 mt-4">
              <ChatBubbleOutlineOutlinedIcon fontSize="small" />
              <span>{comments.length} Comments</span>
            </div>
          </div>
        </Link>
      </CardContent>

      {/* Action Buttons */}
      {isEditable && (
        <div className="flex flex-row mt-4 lg:mt-0 lg:ml-auto items-start">
          <IconButton onClick={(e) => handleOpenEdit(postId, e)}>
            <EditOutlinedIcon />
          </IconButton>
          <IconButton onClick={(e) => handleOpenDelete(postId, e)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </div>
      )}

      {/* Modals */}

      <EditPost
        open={openEdit}
        handleClose={handleCloseEdit}
        postId={currentPostId as number}
        refetchAllPost={refetchAllPost}
      />
      <DeleteConfirm
        open={openDelete}
        handleClose={handleCloseDelete}
        postId={currentPostId as number}
        refetchAllPost={refetchAllPost}
      />
    </Card>
  );
};

export default MainCard;
