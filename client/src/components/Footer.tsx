//Footer.tsx
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <div className="border border-secandary p-3">
      <div className="container-fluid d-flex justify-content-between px-4">
        <div className="d-flex align-items-center gap-3">
          <img
            src="/pwa-512.webp"
            alt="Smart Book logo"
            style={{ height: "32px" }}
          />
          <p className="text-white">
            Finance tracking for individuals and small businesses.
          </p>
        </div>

        <div className="p-4">
          <small className="text-white">
            © {new Date().getFullYear()} SmartBooks Finance |{" "}
            <Link to="/privacy">Privacy Policy</Link> |{" "}
            <Link to="/terms">Terms of Service</Link>
          </small>
        </div>

        <div className="p-2 d-flex flex-column text-white">
          <h6>©matt-solutions</h6>
          <p>Email: smartbooksfinanceapp@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
