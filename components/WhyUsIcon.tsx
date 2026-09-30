import { getIconComponent } from "@/lib/getIconComponent";

type Props = {
  icon?: string;
};
export default function WhyUsIcon({ icon }: Props) {
  return (() => {
    const Icon = getIconComponent(icon);
    return Icon ? (
      <span className="shrink-0 w-10 h-10 rounded-xl bg-main-color/15 flex items-center justify-center">
        <Icon className="w-5 h-5 text-main-color" />
      </span>
    ) : null;
  })();
}
