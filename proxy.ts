import { withAuth } from "next-auth/middleware";

// Runs for every matched request (Next 16 renamed middleware to proxy).
// withAuth redirects unauthenticated users to the sign-in page.
export const proxy = withAuth;

export const config = {
  matcher: [
    "/orders",
    "/profile",
    "/gigs/new",
    "/gigs/edit/:id+",
    "/chats/:path*",
    "/notifications",
  ],
};
