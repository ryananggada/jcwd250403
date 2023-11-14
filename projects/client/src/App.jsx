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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
