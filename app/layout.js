import "./globals.css";

export const metadata = {
  title: "Bhaskar | .NET Developer",
  description:
    ".NET Developer with 3+ years of experience building enterprise web and desktop applications with C#, ASP.NET Core and SQL Server.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
