import { getIconComponent } from "@/lib/getIconComponent";

type Props = {
  icon?: string;
};
export default function ShowSectionIcon({ icon }: Props) {
  return (() => {
    const Icon = getIconComponent(icon);
    return Icon ? (
      <span className="w-16 h-16 rounded-xl bg-main-color/10 flex items-center justify-center mb-6 group-hover:bg-main-color group-hover:shadow-[0_4px_20px_hsl(var(--shadow-gold))] transition-all duration-300">
        <Icon className="size-8 text-main-color group-hover:text-white transition-colors" />
      </span>
    ) : null;
  })();
}
