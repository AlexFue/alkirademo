import { AppBar, Toolbar, Typography, Chip, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

/**
 * Shared shell for authenticated screens: a top AppBar showing the signed-in
 * user's name + role, a logout action, and a content container below it.
 */
export function AppLayout({ userRole, onLogout, children }) {
  return (
    <Box className="min-h-screen" sx={{ bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex justify-between gap-4">
          <Typography variant="h6" component="div">
            Protected Screen
          </Typography>
          <div className="flex items-center gap-3">
            <Chip
              size="small"
              label={userRole === "read-write" ? "Read/Write" : "Read-only"}
              color={userRole === "read-write" ? "secondary" : "default"}
              variant="filled"
            />
            <Button
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <main className="mx-auto max-w-4xl p-6">{children}</main>
    </Box>
  );
}
