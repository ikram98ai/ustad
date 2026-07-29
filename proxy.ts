import { withAuth } from "next-auth/middleware";

// Runs for every matched request (Next 16 renamed middleware to proxy).
// Unauthenticated visitors are redirected to the custom sign-in page.
export const proxy = withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/orders/:path*",
    "/profile",
    "/gigs/new",
    "/gigs/edit/:id+",
    "/chats/:path*",
    "/notifications",
    "/auth/complete-profile",
  ],
};
