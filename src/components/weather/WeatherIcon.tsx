"use client";

import type { LucideProps } from 'lucide-react';
import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudDrizzle, CloudRain, CloudLightning, CloudSnow, CloudFog, HelpCircle, Cloudy } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WeatherIconProps extends Omit<LucideProps, 'className'> {
  iconCode: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType<LucideProps>> = {
  '01d': Sun,
  '01n': Moon,
  '02d': CloudSun,
  '02n': CloudMoon,
  '03d': Cloud,
  '03n': Cloud,
  '04d': Cloudy, // More specific for broken/overcast clouds
  '04n': Cloudy,
  '09d': CloudDrizzle,
  '09n': CloudDrizzle,
  '10d': CloudRain,
  '10n': CloudRain,
  '11d': CloudLightning,
  '11n': CloudLightning,
  '13d': CloudSnow,
  '13n': CloudSnow,
  '50d': CloudFog,
  '50n': CloudFog,
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, className, ...props }) => {
  const IconComponent = iconMap[iconCode] || HelpCircle;
  return <IconComponent className={cn("h-10 w-10", className)} {...props} />;
};
