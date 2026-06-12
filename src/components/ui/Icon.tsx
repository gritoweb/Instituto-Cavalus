import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Book,
  Briefcase,
  Check,
  ChevronDown,
  Heart,
  Landmark,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Share2,
  SlidersVertical,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Trophy,
  Users,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'

// Ícones de marca (removidos do lucide v1) — SVGs inline 1:1 com o HTML.
export { Instagram, Youtube, Facebook } from './BrandIcons'

/** Conjunto de ícones usado no site (Lucide — mesmo set dos SVGs do HTML). */
export const icons = {
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  award: Award,
  book: Book,
  briefcase: Briefcase,
  check: Check,
  'chevron-down': ChevronDown,
  heart: Heart,
  landmark: Landmark,
  lock: Lock,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  phone: Phone,
  search: Search,
  'share-2': Share2,
  sliders: SlidersVertical,
  smartphone: Smartphone,
  sparkles: Sparkles,
  star: Star,
  stethoscope: Stethoscope,
  target: Target,
  trophy: Trophy,
  users: Users,
  x: X,
  zap: Zap,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons

/** Ícones disponíveis para seleção no admin (categorias, features, cards). */
export const selectableIcons: IconName[] = [
  'award',
  'book',
  'briefcase',
  'heart',
  'landmark',
  'smartphone',
  'sparkles',
  'star',
  'stethoscope',
  'target',
  'trophy',
  'users',
]

type IconProps = {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
  'aria-hidden'?: boolean
}

export function Icon({ name, size = 20, strokeWidth = 1.8, className, ...rest }: IconProps) {
  const Cmp = icons[name]
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden {...rest} />
}
