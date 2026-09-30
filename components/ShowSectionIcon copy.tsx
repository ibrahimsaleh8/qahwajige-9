import { getIconComponent } from "@/lib/getIconComponent";

type Props = {
  icon?: string;
};
export default function ShowSectionIcon({ icon }: Props) {
  return (() => {
    const Icon = getIconComponent(icon);
    return Icon ? (
      <span className="w-14 h-14 bg-main-color/10 rounded-2xl flex items-center justify-center mb-6 text-main-color shadow-sm">
        <Icon className="w-7 h-7" />
      </span>
    ) : null;
  })();
}
