import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // محاولة تمرير النافذة الرئيسية للأعلى
    window.scrollTo(0, 0);
    
    // في حال كان السكرول داخل عنصر معين (مثل main في AdminLayout)
    // نحاول الوصول إليه وتصفير السكرول
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
