export default function Footer() {
  return (
    <footer className="w-100 text-light py-2 mt-auto border-top">
      <div className="container-fluid d-flex justify-content-between px-4">
        <div className="d-flex align-items-center gap-3">
          <img
            src="/pwa-512.webp"
            alt="Smart Book logo"
            style={{ height: "32px" }}
          />
          <p>Finance tracking for individuals and small businesses.</p>
        </div>

        <div className="d-flex flex-column">
          <h6>©matt-solutions</h6>
          <p>Email: smartbooksfinanceapp@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
