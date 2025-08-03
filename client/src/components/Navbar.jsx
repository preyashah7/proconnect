import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  useTheme,
  Fade
} from '@mui/material';
// Using Unicode icons instead of @mui/icons-material
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: '🏠 Home Feed', path: '/home' },
    { text: '📊 Dashboard', path: '/dashboard' },
    { text: 'Sign out', action: handleLogout }
  ];

  const drawer = (
    <Box sx={{ width: 250, height: '100%', bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ color: '#0077B5', fontWeight: 700 }}>
          Postify
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#666' }}>
          <span style={{ fontSize: '20px' }}>✕</span>
        </IconButton>
      </Box>
      <List sx={{ pt: 0 }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.text}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#f3f2ef',
              }
            }}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                navigate(item.path);
              }
              setMobileOpen(false);
            }}
          >
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: '#333',
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          top: 0, 
          zIndex: 1100,
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: 60, sm: 64 },
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                color: '#0077B5',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#005885',
                }
              }}
              onClick={() => navigate('/home')}
            >
              ProConnect
            </Typography>
          </Fade>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Fade in={true} timeout={1200}>
              <Box display="flex" gap={0.5}>
                <Button 
                  component={RouterLink} 
                  to="/home" 
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    minWidth: 'auto',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#f3f2ef',
                      color: '#0077B5',
                    },
                    '&.active': {
                      color: '#0077B5',
                      bgcolor: '#f3f2ef',
                    }
                  }}
                >
                  Home
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/dashboard" 
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    minWidth: 'auto',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#f3f2ef',
                      color: '#0077B5',
                    }
                  }}
                >
                   Dashboard
                </Button>
                <Button 
                  onClick={handleLogout}
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    minWidth: 'auto',
                    ml: 1,
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#dc3545',
                      color: 'white',
                      borderColor: '#dc3545',
                    }
                  }}
                >
                  Sign out
                </Button>
              </Box>
            </Fade>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                color: '#666',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f3f2ef',
                }
              }}
            >
              <span style={{ fontSize: '24px' }}>☰</span>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            bgcolor: 'white',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;