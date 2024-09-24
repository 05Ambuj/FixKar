import { useEffect } from 'react';
import i18n from '../utils/i18n';

const useLanguage = () => {
  const setLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getLanguage = () => {
    return i18n.language;
  };

  return { setLanguage, getLanguage };
};

export default useLanguage;