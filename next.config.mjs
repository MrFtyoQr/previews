const nextConfig = {
  // Configuración para ignorar errores de ESLint durante la compilación
  eslint: {
    // Ignorar errores de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  // Configuración para ignorar errores de TypeScript durante la compilación
  typescript: {
    // Ignorar errores de TypeScript durante la compilación
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

