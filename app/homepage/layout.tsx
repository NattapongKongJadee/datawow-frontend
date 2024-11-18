import React from "react";
import Header from "../../components/Header";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen bg-grey100Custom overflow-y-auto">
      <Header />
      <main>{children}</main>
    </div>
  );
}
