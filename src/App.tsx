import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { DeletePostPage } from './pages/DeletePostPage.tsx'
import { EditPostPage } from './pages/EditPostPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { NewPostPage } from './pages/NewPostPage.tsx'
import { PostPage } from './pages/PostPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="about" element={<AboutPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="post/new" element={<NewPostPage />} />
            <Route path="post/:id/edit" element={<EditPostPage />} />
            <Route path="post/:id/delete" element={<DeletePostPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
