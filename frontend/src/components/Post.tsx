import { Box, Text, VStack, Image, HStack, IconButton, Avatar, Divider, Input, Button, Flex, useToast, useColorModeValue } from "@chakra-ui/react";
import { Heart, Trash2 } from "react-feather";
import { useState, useEffect } from "react";
import { useAuth } from "../Auth/Auth";
import { deleteCommentData } from "../Api/deleteData";
import { postCommentData } from "../Api/postData";
import { getCommentData, getUserProfilePic, getUserData } from "../Api/getData";
import { postLikeData } from "../Api/postData";

interface PostProps {
  postId: string;
  author: string;
  content: string;
  topics: string[];
  images: string[];
  likes: number;
  likedBy: string[];
  isVeteran?: boolean;
  onDelete?: (postId: string) => void;
}

interface Comment {
  commentId: string;
  postId: string;
  author: string | null;
  content: string;
  profilePic: string;
}

const Post: React.FC<PostProps> = ({ postId, author, content, topics, images, likes, likedBy, onDelete }) => {
  const { username } = useAuth();
  const [likeCount, setLikeCount] = useState(likes);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [isLiked, setIsLiked] = useState(likedBy.includes(username ?? ''));
  const [profilePic, setProfilePic] = useState<string>('')
  const [isVeteran, setIsVeteran] = useState<boolean | undefined>(true);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const commentBg = useColorModeValue('gray.50', 'gray.600');
  const subtleColor = useColorModeValue('gray.500', 'gray.300');
  const buttonBg = useColorModeValue('gray.500', 'gray.600');
  const buttonColor = useColorModeValue('white', 'white');
  
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (author !== null && author !== undefined) {
        try {
          const pfp = await getUserProfilePic(author);
          setProfilePic(pfp);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      }
    };
    fetchProfilePic();
  }, [author]);

  useEffect(() => {
    const verifyVeteranStatus = async () => {
      if (username) {
        try {
          getUserData({
            username,
            setUserData: (data) => {
              setIsVeteran(data.isVeteran);
            },
            toast,
            checkAdmin: true
          });
        } catch (error) {
          console.error("Failed to verify veteran status:", error);
        }
      }
    };
    verifyVeteranStatus();
  }, [username, toast]);

  const handleLikeToggle = async () => {
    if (!username) return;

    try {
      const response = await postLikeData(postId, username);
      if (response.success) {
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const fetchedComments = await getCommentData(postId);
        // TODO: speed up comment pfp fetching
        const commentsWithPfp = await Promise.all(
          fetchedComments.map(async (comment) => {
            const res = await getUserProfilePic(comment.author!);
            return {
              ...comment,
              profilePic: res,
            };
          })
        );
        setComments(commentsWithPfp);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentData = await postCommentData(postId, username, newComment);
      setComments((prev) => [...prev, {...commentData, profilePic}]); // Update state with the new comment
      setNewComment(""); // Clear the input
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentData(commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <Box p={4} id={postId} bg={cardBg} color={textColor}>
      <Flex justify="space-between" align="center" mb={2}>
        <HStack spacing={2}>
          <Avatar name={author} src={profilePic} size="sm" />
          <Text fontWeight="bold">{author}</Text>
        </HStack>
        {(username === author || !isVeteran) && (
          <IconButton
            aria-label="Delete post"
            icon={<Trash2 size={18} />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => onDelete && onDelete(postId)}
          />
        )}
      </Flex>

      {/* Post Content */}
      <Text mb={4}>{content}</Text>

      {/* Post Images */}
      {images && images.length > 0 && images.some(img => img && img.trim() !== '') && (
        <VStack spacing={2} mb={4}>
          {images
            .filter(img => img && img.trim() !== '')
            .map((image, index) => (
              <Box key={index}>
                {/* Only render the Image component if the URL is valid */}
                {image.startsWith('http') ? (
                  <Image 
                    src={image} 
                    onError={(e) => {
                      // Hide the image element if it fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    fallback={<Box />} // Empty box as fallback
                  />
                ) : null}
              </Box>
            ))}
        </VStack>
      )}

      {/* Post Topics */}
      <HStack spacing={2} mb={4}>
        {topics.map((topic, index) => (
          <Text key={index} fontSize="sm" color={subtleColor}>
            #{topic}
          </Text>
        ))}
      </HStack>

      {/* Like Button */}
      <HStack spacing={4}>
        <IconButton
          aria-label="Like"
          icon={<Heart fill={isLiked ? "red" : "none"} color={isLiked ? "red" : "currentColor"} />}
          variant="ghost"
          onClick={handleLikeToggle}
        />
        <Text>{likeCount} Likes</Text>
      </HStack>
      
      <Divider mb={4} />

      {/* Comments Section */}
      <VStack align="stretch" spacing={4}>
        {/* Add New Comment */}
        <HStack>
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment} bgColor={buttonBg} color={buttonColor}>
            Comment
          </Button>
        </HStack>

        {/* Display Comments */}
        {loadingComments ? (
          <Text>Loading comments...</Text>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Box key={comment.commentId} bg={commentBg} p={2} borderRadius="md">
              <HStack justifyContent="space-between">
                <HStack>
                  <Avatar size="sm" src={comment.profilePic} />
                  <Text fontWeight="bold">{comment.author}</Text>
                </HStack>
                {comment.author === username && (
                  <IconButton
                    aria-label="Delete comment"
                    icon={<Trash2 />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteComment(comment.commentId)}
                  />
                )}
              </HStack>
              <Text mt={1}>{comment.content}</Text>
            </Box>
          ))
        ) : (
          <Text>No comments yet.</Text>
        )}
      </VStack>
      
    </Box>
  );
};

export default Post;
