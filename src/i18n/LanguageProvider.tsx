import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationStrings } from "./translations";
interface LanguageContextValue {
  lang: Language;
  t: TranslationStrings;
  toggleLang: () => void;
}
const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: translations.en,
  toggleLang: () => {},
});
export function useLang() {
  return useContext(LanguageContext);
}
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
