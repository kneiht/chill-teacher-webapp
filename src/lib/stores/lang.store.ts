import { Store } from '@tanstack/react-store'
import translations from '@/lib/utils/translations'

// Define language options
export enum LangOption {
  EN = 'en',
  VI = 'vi',
}

// Define language state
export interface LangState {
  selectedLang: LangOption
}

// Define language store
export const langStore = new Store<LangState>({
  selectedLang: LangOption.EN,
})

// Action to set selected language
export const setSelectedLang = (selectedLang: LangOption) => {
  langStore.setState(() => ({
    selectedLang,
  }))
}

// Action to toggle language
export const toggleLang = () => {
  langStore.setState((prev: LangState) => ({
    selectedLang:
      prev.selectedLang === LangOption.EN ? LangOption.VI : LangOption.EN,
  }))
}

// Getter to get translation
export const t = (key: string): string => {
  const state = langStore.state
  const translation = translations[state.selectedLang][key]
  if (translation) {
    return translation
  }
  console.log('Translation not found for key:', key)
  return key
}
