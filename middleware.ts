export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/chat',
        '/orders',
        '/chats',
        '/profile',
        '/gigs/new',
        '/gigs/edit/:id+'
    ]
}