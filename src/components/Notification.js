import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  ListItemAvatar
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Timer as TimerIcon,
  Home as HomeIcon,
  SimCard as SimIcon,
  Receipt as BillIcon,
  Analytics as UsageIcon,
  Assignment as AssignIcon,
  Payment as PaymentIcon,
  SwapHoriz as ChangePlanIcon,
  Add as AddIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  LocalOffer as PromotionIcon,
  NetworkCheck as NetworkIcon
} from "@mui/icons-material";
import { AuthContext } from '../context/AuthContext.js';

// Mock notification data - in a real app, this would come from your backend
const mockNotifications = [
  {
    id: 1,
    type: 'billing',
    title: 'Bill Generated',
    message: 'Your monthly bill of $42.50 is ready for payment',
    time: '10 minutes ago',
    read: false,
    icon: <BillIcon color="primary" />
  },
  {
    id: 2,
    type: 'usage',
    title: 'High Data Usage',
    message: 'You\'ve used 85% of your monthly data allowance',
    time: '2 hours ago',
    read: false,
    icon: <WarningIcon color="warning" />
  },
  {
    id: 3,
    type: 'promotion',
    title: 'New Plan Available',
    message: 'Special offer: 20% more data for the same price',
    time: '1 day ago',
    read: true,
    icon: <PromotionIcon color="secondary" />
  },
  {
    id: 4,
    type: 'system',
    title: 'Network Maintenance',
    message: 'Scheduled maintenance on Tuesday 2AM-4AM may cause brief disruptions',
    time: '2 days ago',
    read: true,
    icon: <NetworkIcon color="info" />
  },
  {
    id: 5,
    type: 'success',
    title: 'Payment Processed',
    message: 'Your payment of $42.50 was successfully processed',
    time: '3 days ago',
    read: true,
    icon: <SuccessIcon color="success" />
  }
];

export default function TelecomNavbar({ role }) {
  const navigate = useNavigate();
  const { logoutUser, timeLeft, user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    handleNotificationsClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Admin navigation items
  const adminNavigation = [
    { label: "Dashboard", path: "/admin/homeAdmin", icon: <HomeIcon /> },
    { label: "Plan Management", path: "/admin/plans", icon: <PaymentIcon /> },
    { label: "Usage Analytics", path: "/admin/usages", icon: <UsageIcon /> },
    { label: "Billing", path: "/admin/bills", icon: <BillIcon /> },
    { label: "SIM Inventory", path: "/admin/sims", icon: <SimIcon /> },
    { label: "SIM Assignment", path: "/admin/assign-sim", icon: <AssignIcon /> },
  ];

  // User navigation items
  const userNavigation = [
    { label: "Dashboard", path: "/user/homeUser", icon: <HomeIcon /> },
    { label: "My Usage", path: "/user/my-usages", icon: <UsageIcon /> },
    { label: "Request SIM", path: "/user/apply-sim", icon: <AddIcon /> },
    { label: "My Plans", path: "/user/my-plans", icon: <PaymentIcon /> },
    { label: "Active Plans", path: "/user/Active-Plans", icon: <PaymentIcon /> },
    { label: "Recharge", path: "/user/Recharge-SIM", icon: <PaymentIcon />, tag: "Prepaid" },
    { label: "My Bills", path: "/user/BillList", icon: <BillIcon />, tag: "Postpaid" },
    { label: "Change Plan", path: "/user/ChangePlanPostpaid", icon: <ChangePlanIcon />, tag: "Postpaid" },
  ];

  const navigationItems = role === "ADMIN" ? adminNavigation : userNavigation;

  // Render desktop navigation
  const renderDesktopNavigation = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mx: 2 }}>
      {navigationItems.map((item) => (
        <Tooltip key={item.label} title={item.label} arrow>
          <Button
            color="inherit"
            onClick={() => navigate(item.path)}
            startIcon={item.icon}
            sx={{ 
              fontSize: "0.8rem",
              minWidth: 'auto',
              px: 1.5,
              py: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }
            }}
          >
            {item.label}
            {item.tag && (
              <Chip 
                label={item.tag} 
                size="small" 
                sx={{ 
                  ml: 1, 
                  height: 20, 
                  fontSize: '0.6rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }} 
              />
            )}
          </Button>
        </Tooltip>
      ))}
    </Box>
  );

  // Render mobile navigation drawer
  const renderMobileNavigation = () => (
    <>
      <IconButton
        color="inherit"
        onClick={() => setMobileMenuOpen(true)}
        sx={{ display: { xs: 'flex', lg: 'none' }, mr: 1 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { 
            width: 280,
            background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
            color: 'white'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
            TelecomHub
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
            <AccountIcon sx={{ mr: 1.5 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {role === "ADMIN" ? "Administrator" : "Customer"}
              </Typography>
            </Box>
          </Box>
          
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                sx={{
                  py: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  secondary={item.tag ? `(${item.tag})` : null}
                  secondaryTypographyProps={{ sx: { fontSize: '0.7rem', opacity: 0.7 } }}
                />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />
          
          <Box sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimerIcon sx={{ fontSize: '1rem', mr: 1 }} />
              <Typography variant="body2">
                Session expires in:
              </Typography>
            </Box>
            <Chip 
              label={formatTime(timeLeft)} 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: '100%'
              }} 
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );

  // Render notifications menu
  const renderNotificationsMenu = () => (
    <>
      <Tooltip title="Notifications" arrow>
        <IconButton color="inherit" onClick={handleNotificationsOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: { 
            width: 360,
            maxHeight: 440,
            mt: 1.5
          }
        }}
        MenuListProps={{
          sx: { py: 0 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>
        </Box>
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ py: 0, maxHeight: 300, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  onClick={() => markAsRead(notification.id)}
                  sx={{ 
                    py: 1.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: notification.read ? 'transparent' : 'action.hover'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'transparent' }}>
                      {notification.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="subtitle2" noWrap>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </List>
            
            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
              <Button 
                fullWidth 
                size="small" 
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                Clear all notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar>
        {/* Logo/Brand */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: 3
          }}
        >
          TelecomHub
        </Typography>

        {/* Navigation Items */}
        {!isMobile && renderDesktopNavigation()}
        
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right-side actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          {renderNotificationsMenu()}

          {/* Session Timer */}
          {!isMobile && (
            <Tooltip title="Session timeout" arrow>
              <Chip
                icon={<TimerIcon />}
                label={formatTime(timeLeft)}
                variant="outlined"
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Tooltip>
          )}

          {/* User Profile */}
          <Tooltip title={user?.name || 'User Profile'} arrow>
            <Chip
              icon={<AccountIcon />}
              label={role === "ADMIN" ? "Admin" : "User"}
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Tooltip>

          {/* Mobile Menu */}
          {renderMobileNavigation()}

          {/* Logout */}
          <Tooltip title="Logout" arrow>
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}