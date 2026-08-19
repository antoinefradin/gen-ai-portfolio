import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BlogIndex from "./pages/BlogIndex.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import { CursorProvider } from "./context/CursorContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CursorProvider>
          <CustomCursor />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </CursorProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
