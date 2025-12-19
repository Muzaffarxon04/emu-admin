import { NotFound } from "components/404";
import AppLayout from "layout/app-layout";
import { shallowEqual, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AppRoutes from "routers";
import Auth from "view/auth/login";
import Events from "view/events";
import EventDetail from "view/events/detail";

//  git config user.email "abdulloh7860@gmail.com"
//  git config user.name "Abdulloh0109"
function App() {
  const { user } = useSelector((state: any) => state.auth, shallowEqual);

  const auth = (children: any) => {
    if (user) {
      return <Navigate to={`/`} replace />;
    }

    return children;
  };

  const login = (children: any) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div>
      <Routes>
        <Route index path="/login" element={auth(<Auth />)} />

        <Route path="" element={login(<AppLayout />)}>
          <Route path="/" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          {AppRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
