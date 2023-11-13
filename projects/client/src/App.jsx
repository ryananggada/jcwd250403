import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TenantCategories from './pages/TenantCategories';
import CreateCategory from './pages/CreateCategory';
import EditCategory from './pages/EditCategory';
import TenantProperties from './pages/TenantProperties';
import NotFound from './pages/NotFound';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
