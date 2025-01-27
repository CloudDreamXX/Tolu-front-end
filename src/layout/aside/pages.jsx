// import {
//   BuildingInfoFilledIcon,
//   BuildingInfoIcon,
//   DashboardFilledIcon,
//   DashboardIcon,
//   ParkingAsideIcon,
//   ParkingFilledIcon,
//   WalletFilledIcon,
//   WalletIcon,
// } from "../../assets/svgs/Icon";

export const pages = [
  {
    id: 1,
    title: "Dashboard",
    link: ["/admin", "/manager", "/user"],
    // icon: <DashboardIcon />,
    // filledIcon: <DashboardFilledIcon />,
  },
  {
    id: 2,
    title: "Building Info",
    link: [
      "/admin/building-info",
      "/manager/building-info",
      // "/user/building-info",
    ],
    // icon: <BuildingInfoIcon />,
    // filledIcon: <BuildingInfoFilledIcon />,
  },
  {
    id: 3,
    title: "Parking Summary",
    link: [
      "/admin/parking-summary",
      "/manager/parking-summary",
      "/user/booking-summary",
    ],
    // icon: <ParkingAsideIcon />,
    // filledIcon: <ParkingFilledIcon />,
  },
  {
    id: 4,
    title: "Wallet",
    link: ["/admin/wallet", "/manager/wallet"],
    // icon: <WalletIcon />,
    // filledIcon: <WalletFilledIcon />,
  },
];
