import { Outlet } from "react-router-dom";
import AppHeader from "@/components/layouts/app.header";
import { useState } from "react";

function Layout() {
  const [dataSearch, setDataSearch] = useState<string>("");
  return (
    <div>
      <AppHeader dataSearch={dataSearch} setDataSearch={setDataSearch} />
      <Outlet context={[dataSearch, setDataSearch]} />
    </div>
  );
}

export default Layout;
