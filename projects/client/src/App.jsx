import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TenantCategories from './pages/TenantCategories';
import CreateCategory from './pages/CreateCategory';
import EditCategory from './pages/EditCategory';
import TenantProperties from './pages/TenantProperties';
import NotFound from './pages/NotFound';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import TenantRooms from './pages/TenantRooms';
import CreateRoom from './pages/CreateRoom';
import EditRoom from './pages/EditRoom';
import UserSignup from './pages/UserSignup';
import TenantAvailability from './pages/TenantAvailability';
import AddAvailability from './pages/AddAvailability';
import VerifyUser from './pages/VerifyUser';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/tenant/categories" element={<TenantCategories />} />
      <Route path="/tenant/categories/create" element={<CreateCategory />} />
      <Route path="/tenant/categories/edit/:id" element={<EditCategory />} />
      <Route path="/tenant/properties" element={<TenantProperties />} />
      <Route path="/tenant/properties/create" element={<CreateProperty />} />
      <Route path="/tenant/properties/edit/:id" element={<EditProperty />} />
      <Route path="/tenant/rooms" element={<TenantRooms />} />
      <Route path="/tenant/rooms/create" element={<CreateRoom />} />
      <Route path="/tenant/rooms/edit/:id" element={<EditRoom />} />
      <Route path="/tenant/availabilities" element={<TenantAvailability />} />
      <Route
        path="/tenant/availabilities/add/:id"
        element={<AddAvailability />}
      />
      <Route path="/verify/:id" element={<VerifyUser />} />
      <Route path="/user/signup" element={<UserSignup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
