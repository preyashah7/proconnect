import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  Fade,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentUserId, setCurrentUserId] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));
        setCurrentUserId(decodedPayload.id);
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }
  }, []);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`https://proconnect-6254.onrender.com/api/users/${userId}`),
          axios.get("https://proconnect-6254.onrender.com/api/posts"),
        ]);

        setUser(userRes.data);
        const filteredPosts = postsRes.data.filter(
          (post) => post.user._id === userId
        );
        setUserPosts(filteredPosts);
      } catch (err) {
        console.error("Error loading user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getLinkedInColor = (userId) => {
    const colors = [
      '#0077B5', '#2867B2', '#1B4F72', '#2E86AB', 
      '#0E76A8', '#1E88E5', '#1976D2', '#0D47A1'
    ];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return postDate.toLocaleDateString();
  };

  const handleLikeToggle = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://proconnect-6254.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: res.data.liked
                  ? [...post.likes, currentUserId]
                  : post.likes.filter((id) => id !== currentUserId),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };

  const LoadingSkeleton = () => (
    <Container maxWidth="md" sx={{ pt: 3 }}>
      {/* Profile Header Skeleton */}
      <Card sx={{ mb: 3, borderRadius: 3, bgcolor: 'white' }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ 
            width: 120, 
            height: 120, 
            bgcolor: '#f0f0f0', 
            borderRadius: '50%', 
            mx: 'auto', 
            mb: 2 
          }} />
          <Box sx={{ width: '60%', height: 32, bgcolor: '#f0f0f0', borderRadius: 1, mx: 'auto', mb: 1 }} />
          <Box sx={{ width: '80%', height: 20, bgcolor: '#f5f5f5', borderRadius: 1, mx: 'auto' }} />
        </Box>
      </Card>
      
      {/* Posts Skeleton */}
      {[1, 2].map((item) => (
        <Card key={item} sx={{ mb: 2, borderRadius: 2, bgcolor: 'white' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ width: '30%', height: 16, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }} />
            <Box sx={{ width: '100%', height: 16, bgcolor: '#f0f0f0', borderRadius: 1, mb: 1 }} />
            <Box sx={{ width: '80%', height: 16, bgcolor: '#f0f0f0', borderRadius: 1 }} />
          </CardContent>
        </Card>
      ))}
    </Container>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f3f2ef' }}>
        <Navbar />
        <LoadingSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f3f2ef',
    }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ pt: 3, pb: 6 }}>
        {user && (
          <Fade in={true} timeout={600}>
            <Card sx={{ 
              mb: 3, 
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}>
              {/* Cover Area */}
              <Box sx={{
                height: { xs: 120, sm: 150 },
                background: `linear-gradient(135deg, ${getLinkedInColor(userId)} 0%, ${getLinkedInColor(userId)}88 100%)`,
                position: 'relative'
              }}>
                {/* Profile Picture */}
                <Avatar
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    bgcolor: getLinkedInColor(userId),
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    fontWeight: 700,
                    position: 'absolute',
                    bottom: { xs: -50, sm: -60 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
              </Box>

              {/* Profile Info */}
              <CardContent sx={{ 
                pt: { xs: 7, sm: 8 }, 
                pb: 3, 
                textAlign: 'center' 
              }}>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}
                >
                  {user.name}
                </Typography>
                
                {user.bio && (
                  <Typography 
                    variant="h6" 
                    sx={{
                      color: '#666',
                      fontWeight: 400,
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.4
                    }}
                  >
                    {user.bio}
                  </Typography>
                )}

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2, 
                  mt: 3,
                  flexWrap: 'wrap'
                }}>
                  <Chip
                    label={`${userPosts.length} ${userPosts.length === 1 ? 'Post' : 'Posts'}`}
                    sx={{
                      bgcolor: '#0077B5',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#005885' }
                    }}
                  />
                  <Chip
                    label="Professional"
                    variant="outlined"
                    sx={{
                      borderColor: '#0077B5',
                      color: '#0077B5',
                      fontWeight: 500
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Posts Section */}
        <Fade in={true} timeout={800}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 3,
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}
            >
              Posts by {user?.name}
            </Typography>

            {userPosts.length === 0 ? (
              <Card sx={{ 
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                p: 4
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    color: '#0077B5',
                    fontWeight: 600
                  }}
                >
                  ✨ No Posts Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.name} hasn't shared any posts yet. Check back later!
                </Typography>
              </Card>
            ) : (
              <Box>
                {userPosts.map((post, index) => (
                  <Fade 
                    key={post._id} 
                    in={true} 
                    timeout={600 + (index * 150)}
                  >
                    <Card 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        bgcolor: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        {/* Post Header */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2
                        }}>
                          <Avatar
                            sx={{
                              bgcolor: getLinkedInColor(userId),
                              width: 40,
                              height: 40,
                              mr: 2,
                              fontSize: '0.9rem',
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(user?.name)}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 600,
                                color: '#0077B5',
                                fontSize: '1rem',
                              }}
                            >
                              {user?.name}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#999',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {formatTimeAgo(post.createdAt)}
                              </Typography>
                              <Typography sx={{ color: '#999', fontSize: '0.75rem' }}>•</Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#999',
                                  fontSize: '0.75rem',
                                }}
                              >
                                🌐 Public
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Post Content */}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                            lineHeight: 1.5,
                            color: '#333',
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          {post.content}
                        </Typography>
                          
                        <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                        <Box
                          onClick={() => handleLikeToggle(post._id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            py: 1,
                            px: 2,
                            borderRadius: 1,
                            transition: 'background-color 0.2s ease',
                            '&:hover': { bgcolor: '#f5f5f5' },
                            width: 'fit-content',
                            ml: -1,
                            mt: 1
                          }}
                        >
                          <span style={{ marginRight: '6px', fontSize: '16px' }}>
                            {post.likes?.includes(currentUserId) ? '❤️' : '🤍'}
                          </span>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                          </Typography>
                        </Box>

                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default UserProfilePage;