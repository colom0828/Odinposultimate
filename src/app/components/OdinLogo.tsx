import logoImage from "figma:asset/33a917b0e02a7df8dc35464e342cbfb8f71701eb.png";

interface OdinLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showGlow?: boolean;
}

export function OdinLogo({ size = 'md', showGlow = false }: OdinLogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
    '3xl': 'w-40 h-40'
  };

  return (
    <div className="relative inline-block">
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-full blur-xl opacity-50"></div>
      )}
      <img 
        src={logoImage}
        alt="ODIN POS Logo" 
        className={`${sizes[size]} relative z-10`}
      />
    </div>
  );
}