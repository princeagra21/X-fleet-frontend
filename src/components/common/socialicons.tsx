import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function SocialIcons() {
  const iconStyle = "w-6 h-6 text-gray-700 hover:text-black transition-colors";

  return (
    <div className="flex gap-4 mt-4">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebook className={iconStyle} />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter className={iconStyle} />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <FaLinkedin className={iconStyle} />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram className={iconStyle} />
      </a>
    </div>
  );
}