// UI components
import { App as AntApp } from 'antd'

// Hooks
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'

// Stores
import {
  t,
  LangOption,
  langStore,
  setSelectedLang,
  toggleLang as toggleLangAction,
} from '@/lib/stores/lang.store'

// Utils
import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

// Return type for this hook
interface LangContextType {
  selectedLang: LangOption
  toggleLang: () => void
  t: (key: string) => string
}

// Custom hook for managing language state (EN/VI).
export const useLang = (): LangContextType => {
  const { message } = AntApp.useApp()
  const state = useStore(langStore)

  // Load saved language from localStorage on mount
  useEffect(() => {
    const lang = getFromLocalStorage(LocalStorageKeys.LANG)
    if (lang) {
      setSelectedLang(lang as LangOption)
    }
  }, [])

  // Save language changes to localStorage
  useEffect(() => {
    setToLocalStorage(LocalStorageKeys.LANG, state.selectedLang)
  }, [state.selectedLang])

  // Toggle between English and Vietnamese
  const toggleLang = () => {
    toggleLangAction()
    if (state.selectedLang === LangOption.EN) {
      message.success('Language changed to English')
    } else {
      message.success('Ngôn ngữ đã thay đổi thành Tiếng Việt')
    }
  }

  // Return language state, toggle function, and translation function
  return {
    selectedLang: state.selectedLang,
    toggleLang,
    t,
  }
}
