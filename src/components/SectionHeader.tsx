import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkText?: string;
}

const SectionHeader = ({ title, linkTo, linkText = "Ver todo" }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    {linkTo && (
      <Link
        to={linkTo}
        className="flex items-center gap-0.5 text-sm text-primary font-medium hover:underline"
      >
        {linkText}
        <ChevronRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

export default SectionHeader;
