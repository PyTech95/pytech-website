import {
  Code2, Palette, TrendingUp, Bot, Globe, Smartphone, Server, Gamepad2,
  BadgeCheck, Box, PenTool, Package, Megaphone, Search, Sparkles,
  MessageCircle, MessageSquare, PhoneCall, Workflow,
} from 'lucide-react';

const MAP = {
  Code2, Palette, TrendingUp, Bot, Globe, Smartphone, Server, Gamepad2,
  BadgeCheck, Box, PenTool, Package, Megaphone, Search, Sparkles,
  MessageCircle, MessageSquare, PhoneCall, Workflow,
};

export function Icon({ name, ...props }) {
  const C = MAP[name] || Sparkles;
  return <C {...props} />;
}

export default Icon;
