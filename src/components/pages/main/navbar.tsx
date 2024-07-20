import { Link } from "@/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
const ThemeSwitcher = dynamic(() => import("./theme-switcher"));

const Navbar: React.FC = () => {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
