import { lazy } from "react";

const AppRoutes = [
  {
    path: "stories",
    component: lazy(() => import("view/stories")),
  },
  {
    path: "events",
    component: lazy(() => import("view/events")),
  },
  {
    path: "news",
    component: lazy(() => import("view/news")),
  },
  {
    path: "shop",
    component: lazy(() => import("view/shop")),
  },
  {
    path: "applications",
    component: lazy(() => import("view/applications")),
  },
  {
    path: "grants",
    component: lazy(() => import("view/grants")),
  },
  {
    path: "users",
    component: lazy(() => import("view/users")),
  },
  {
    path: "faq",
    component: lazy(() => import("view/faq")),
  },
  {
    path: "directory",
    component: lazy(() => import("view/directory")),
  },
  {
    path: "media",
    component: lazy(() => import("view/media")),
  },
  {
    path: "points-history",
    component: lazy(() => import("view/pointsHistory")),
  },
];

export default AppRoutes;
