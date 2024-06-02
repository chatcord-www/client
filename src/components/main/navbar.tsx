import ThemeSwitcher from "./theme-switcher";
import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
