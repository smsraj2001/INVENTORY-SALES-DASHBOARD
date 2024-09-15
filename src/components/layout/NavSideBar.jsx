import * as React from "react";
import { useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import BikeScooterIcon from "@mui/icons-material/BikeScooter";
import AddIcon from "@mui/icons-material/Add";
import BadgeIcon from "@mui/icons-material/Badge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from '@mui/icons-material/Home';

// Profile menu items



const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const NavSideBar = () => {
  // Define logout function
  let logout = () => {
    localStorage.setItem("user", false);
    navigate('/login');

    return (
      <div className="text-center mt-5">
        <h1>Logging Out...</h1>
      </div>
    );
  };
  const settings = ["Profile", "Logout"];
  const settingslink = ["/userprofile", logout]; // Corresponding actions (routes or functions)


  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null); // For user profile menu
  const userDept = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log(userDept.department);
  }, []);

  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuItemClick = (path) => () => {
    navigate(path);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {/* Employees */}
        {userDept.department !== "Sales" &&
          userDept.department !== "Inventory" ? (
          <>
            <ListItem disablePadding>
              <ListItemButton >
                <ListItemIcon>
                  <BadgeIcon />
                </ListItemIcon>
                <ListItemText primary="Employees" />
              </ListItemButton>
            </ListItem>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={handleMenuItemClick("/employeeform")}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Employee" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={handleMenuItemClick("/employeelist")}
                >
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Employee List" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        ) : (
          ""
        )}

        {/* Vehicle submenu always visible */}
        <ListItem disablePadding>
          <ListItemButton >
            <ListItemIcon>
              <BikeScooterIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicles" />
          </ListItemButton>
        </ListItem>
        <List component="div" disablePadding>
          {/* Only non-Sales and non-Inventory can Add, Update, and Remove */}
          {userDept.department !== "Sales" &&
            userDept.department !== "Inventory" ? (
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={handleMenuItemClick("/vehicle/create")}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add" />
              </ListItemButton>
            </ListItem>
          ) : (
            ""
          )}
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={handleMenuItemClick("/vehicle/list")}
            >
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="View" />
            </ListItemButton>
          </ListItem>
          {userDept.department !== "Sales" &&
            userDept.department !== "Inventory" ? (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={handleMenuItemClick("/vehicle/select")}
                >
                  <ListItemIcon>
                    <UpdateIcon />
                  </ListItemIcon>
                  <ListItemText primary="Update" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={handleMenuItemClick("/vehicle/delete")}
                >
                  <ListItemIcon>
                    <DeleteOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Remove" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            ""
          )}
        </List>

        {/* Stock submenu visible for Inventory and non-Sales users */}
        {userDept.department !== "Sales" ? (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Stock" />
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}
        {userDept.department !== "Sales" ? (
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={handleMenuItemClick("/stock/update")}
              >
                <ListItemIcon>
                  <UpdateIcon />
                </ListItemIcon>
                <ListItemText primary="Update" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={handleMenuItemClick("/stock/lowstock")}
              >
                <ListItemIcon>
                  <ProductionQuantityLimitsIcon />
                </ListItemIcon>
                <ListItemText primary="Low Stock" />
              </ListItemButton>
            </ListItem>
          </List>
        ) : (
          ""
        )}

        {/* Sales and Reports */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItemButton>
        </ListItem>

        <List component="div" disablePadding>
          {/* Place Order visible only to Sales users */}
          {userDept.department === "Sales" && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={handleMenuItemClick("/salesform")}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Place Order" />
              </ListItemButton>
            </ListItem>
          )}

          {/* Approve Sales visible for Admin and Inventory users */}
          {(userDept.department === "Inventory" || userDept.department === "Admin") && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={handleMenuItemClick("/salesapproval")}
              >
                <ListItemIcon>
                  <AddTaskIcon />
                </ListItemIcon>
                <ListItemText primary="Approve/Reject" />
              </ListItemButton>
            </ListItem>
          )}

          {/* View Sales visible for Sales users */}
          {userDept.department === "Sales" && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={handleMenuItemClick("/saleslist")}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="View" />
              </ListItemButton>
            </ListItem>
          )}
        </List>


        {/* Reports visible for non-Sales users */}
        {userDept.department !== "Sales" ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleMenuItemClick("/reports")}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}
      </List>

      <Divider />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Centered Typography */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              TVS MOTOR INVENTORY AND SALES
            </Typography>
          </Box>

          {/* Home Icon */}
          <IconButton
            size="large"
            color="inherit"
            aria-label="home"
            sx={{
              backgroundColor: 'darkgrey',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'skyblue',
              },
              p: 1,
            }}
            onClick={() => navigate('/home')}
          >
            <HomeIcon />
          </IconButton>

          {/* Search Input */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* User Profile Section */}
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Profile" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    // Check if the action is a function (logout) or a route (profile)
                    typeof settingslink[index] === 'function'
                      ? settingslink[index]() // Call logout function
                      : navigate(settingslink[index]); // Navigate to route
                    handleCloseUserMenu(); // Close the menu after the action
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>

      </AppBar>

      {/* Drawer component */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </Box>
  );
}

export default NavSideBar