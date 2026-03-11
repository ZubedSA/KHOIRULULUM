/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Optimize images
    images: {
        formats: ['image/avif', 'image/webp'],
    },

    // Experimental features for better performance
    experimental: {
        // Optimize package imports for faster builds
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },

    // Compiler options for production
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === 'production',
    },
};

export default nextConfig;
