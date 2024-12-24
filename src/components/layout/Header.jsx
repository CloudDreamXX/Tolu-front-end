import logo from "../../assets/images/logo.png";
import callIcon from "../../assets/images/home/callIcon.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <section className="w-full bg-white drop-shadow-md">
      <section className="container mx-auto">
        <div className="flex items-center justify-between h-[70px] my-auto px-4">
          <Link to="/">
            <img src={logo} alt="logo" className="w-[80px]" />
          </Link>
          <div className="flex items-center gap-5">
            <button>
              <img src={callIcon} alt="icon" />
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Header;
