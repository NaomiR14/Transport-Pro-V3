import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilita el output standalone para Docker
  output: 'standalone',
  
  // Configuración para conectar con la API de C#
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://api:8080'}/api/:path*`,
      },
    ];
  },
  
  /* otras opciones de configuración aquí */
};

export default nextConfig;