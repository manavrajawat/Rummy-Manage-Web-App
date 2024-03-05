/** @format */
"use client";

import { useState } from "react";
import { Nav } from "./ui/nav";

type Props = {};

import {
  LayoutDashboard,
  Settings,
  PlusCircle,
  List,
  ChevronRight,
  Megaphone,
  Move3D,
} from "lucide-react";
import { Button } from "./ui/button";

import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;
  const [isCollapsed, setIsCollapsed] = useState(true);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="flex z-10">
      {mobileWidth && (
        <div className="absolute top-7 left-3">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <div
        className={`min-w-[80px] border-r px-3 pb-10 pt-24 ${
          (mobileWidth && isCollapsed) ? 'hidden' : ''
        }`}
        style={{ flex: `0 0 ${mobileWidth && isCollapsed ? '0' : '240px'}` }}
      >
        <Nav
          isCollapsed={mobileWidth ? isCollapsed : false}
          links={[
            {
              title: "Dashboard",
              href: "/rummy/dashboard",
              icon: LayoutDashboard,
              variant: "default",
            },
            {
              title: "Add-App",
              href: "/rummy/users",
              icon: PlusCircle,
              variant: "ghost",
            },
            {
              title: "App-List",
              href: "/rummy/order",
              icon: List,
              variant: "ghost",
            },
            {
              title: "Advertisement",
              href: "/rummy/settings",
              icon: Megaphone,
              variant: "ghost",
            },
            {
              title: "Site-Settings",
              href: "/rummy/formsite",
              icon: Settings,
              variant: "ghost",
            },
            {
              title: "Ranking-Apps",
              href: "/rummy/ranking",
              icon: Move3D,
              variant: "ghost",
            },
          ]}
        />
      </div>
      <div
        className={`flex-grow p-6 ml-${mobileWidth && !isCollapsed ? '240' : '0'}`}
      >
        {/* Your main content goes here */}
      </div>
    </div>
  );
}
