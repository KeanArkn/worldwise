import { Suspense, lazy } from "react";

import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/FakeAuthContext";
import { CitiesProvider } from "./contexts/CitiesContext";
import ProtectedRoute from "./pages/ProtectedRoute";

// import Homepage from "../src/pages/Homepage"
// import Product from "../src/pages/Product"
// import Pricing from "../src/pages/Pricing"
// import Login from "./pages/Login";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "../src/pages/PageNotFound"

const Homepage = lazy(() => import("../src/pages/Homepage"));
const Product = lazy(() => import("../src/pages/Product"));
const Pricing = lazy(() => import("../src/pages/Pricing"));
const Login = lazy(() => import("../src/pages/Login"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("../src/pages/PageNotFound"));

import SpinnerFullPage from "./components/SpinnerFullPage";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

export default function App() {
  
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute> }>
                <Route index element={<Navigate replace to='cities' />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} /> 
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route index element={<Homepage />} />
              <Route path="*" element={<PageNotFound/>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>


  )
}
