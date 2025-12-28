import {
  Home,
  User,
  Settings,
  Sparkles,
  Heart,
  ThumbsDown,
  MessageCircle,
  Share2,
  Plus,
  Upload,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Trash2,
  Edit,
  Send,
  ArrowLeft,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle,
  Globe,
  Clock,
  Utensils,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react"
import React from "react"

export type Icon = LucideIcon

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Logo = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ alt, ...props }, ref) => (
  <img
    ref={ref}
    alt="logo"
    src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreigiwlkpkd5z3ge2o7m2lv4pykgvxd2toowpazhyo4iohc5u3prrae"
    {...props}
  />
))
Logo.displayName = "Logo"

export const Icons = {
  upload: Upload,
  logo: Logo,
  home: Home,
  user: User,
  settings: Settings,
  chef: Sparkles,
  like: Heart,
  dislike: ThumbsDown,
  comment: MessageCircle,
  share: Share2,
  plus: Plus,
  search: Search,
  menu: Menu,
  close: X,
  sun: Sun,
  moon: Moon,
  logout: LogOut,
  trash: Trash2,
  edit: Edit,
  send: Send,
  back: ArrowLeft,
  chevronRight: ChevronRight,
  spinner: Loader2,
  check: Check,
  alert: AlertCircle,
  globe: Globe,
  clock: Clock,
  utensils: Utensils,
  eye: Eye,
  eyeOff: EyeOff,
}
