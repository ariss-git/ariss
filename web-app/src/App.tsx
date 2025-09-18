import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Category from './pages/Category/Index';
import AdminLayout from './layouts/MainLayout';
import { ThemeProvider } from './components/theme-provider';
import AddCategory from './pages/Category/AddCategory';
import { Toaster } from './components/ui/toaster';
import CategoryDetails from './pages/Category/CategoryDetails';
import Subcategory from './pages/SubCategory/Index';
import AddSubcategory from './pages/SubCategory/AddSubCategory';
import SubcategoryDetails from './pages/SubCategory/SubcategoryDetails';
import Customer from './pages/Customer/Index';
import ApprovedDealers from './pages/Customer/ApprovedDealers/Index';
import NotApprovedDealers from './pages/Customer/NotApprovedDealers/Index';
import Technicians from './pages/Technician/Index';
import BackOffices from './pages/Back-Office/Index';
import Distributors from './pages/Distributor/Index';
import Product from './pages/Product/Index';
import AddProduct from './pages/Product/AddProduct';
import AddDiscount from './pages/Discount/AddDiscount';
import Discounts from './pages/Discount/Index';
import RMA from './pages/RMA/Index';
import FetchSingleRMA from './pages/RMA/FetchSingleRMA';
import SingleDealer from './pages/Customer/FetchSingleDealer';
import ProfilePic from './_components/ProfilePic';
import FetchSingleProduct from './pages/Product/FetchSingleProduct';
import Courses from './pages/Courses/Index';
import AddCourse from './pages/Courses/AddCouse';
import FetchSingleCourse from './pages/Courses/FetchSingleCourse';
import Login from './pages/Admin/Login';
import AddBackOffice from './pages/Back-Office/AddBackOffice';

import AddDealer from './pages/Customer/ApprovedDealers/AddDealer';
import Orders from './pages/Order/Index';
import Invoices from './pages/Invoice/Index';
import AddQuestionsToCourse from './pages/Courses/AddQuestions';

function App() {
    return (
        <ThemeProvider defaultTheme="light">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />

                        <Route path="products" element={<Product />} />
                        <Route path="products/add" element={<AddProduct />} />
                        <Route path="products/:product_id" element={<FetchSingleProduct />} />

                        <Route path="categories" element={<Category />} />
                        <Route path="categories/add" element={<AddCategory />} />
                        <Route path="categories/:category_id" element={<CategoryDetails />} />

                        <Route path="subcategories" element={<Subcategory />} />
                        <Route path="subcategories/add" element={<AddSubcategory />} />
                        <Route path="subcategories/:subcategory_id" element={<SubcategoryDetails />} />

                        <Route path="customers" element={<Customer />} />

                        <Route path="customers/dealers/approved" element={<ApprovedDealers />} />
                        <Route path="customers/dealers/not-approved" element={<NotApprovedDealers />} />
                        <Route path="customers/dealers/view-edit/:dealer_id" element={<SingleDealer />} />
                        <Route path="customers/dealer/pfp/:dealer_id" element={<ProfilePic />} />
                        <Route path="customers/dealers/add" element={<AddDealer />} />

                        <Route path="customers/technicians" element={<Technicians />} />

                        <Route path="customers/backoffices" element={<BackOffices />} />
                        <Route path="customers/backoffices/add" element={<AddBackOffice />} />

                        <Route path="customers/distributors" element={<Distributors />} />

                        <Route path="discounts" element={<Discounts />} />
                        <Route path="discounts/add" element={<AddDiscount />} />

                        <Route path="rma" element={<RMA />} />
                        <Route path="rma/:rma_id" element={<FetchSingleRMA />} />

                        <Route path="courses" element={<Courses />} />
                        <Route path="courses/add" element={<AddCourse />} />
                        <Route path="courses/:course_id" element={<FetchSingleCourse />} />
                        <Route path="courses/questions/:courseID" element={<AddQuestionsToCourse />} />

                        <Route path="orders" element={<Orders />} />

                        <Route path="invoices" element={<Invoices />} />
                    </Route>

                    <Route path="/login" element={<Login />}>
                        <Route path="login/employee" />
                        <Route path="register/employee" />
                    </Route>
                </Routes>
                <Toaster />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
