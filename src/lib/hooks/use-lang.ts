import { App as AntApp } from 'antd'
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import type { LangState } from '@/lib/stores/lang.store'
import {
  LangOption,
  langStore,
  setSelectedLang,
  t,
  toggleLang as toggleLangAction,
} from '@/lib/stores/lang.store'
import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

interface LangContextType {
  selectedLang: LangOption
  toggleLang: () => void
  t: (key: string) => string
}

export const useLang = (): LangContextType => {
  const { message } = AntApp.useApp()
  const state = useStore(langStore)

  useEffect(() => {
    const lang = getFromLocalStorage(LocalStorageKeys.LANG)
    if (lang) {
      setSelectedLang(lang as LangOption)
    }
  }, [])

  useEffect(() => {
    setToLocalStorage(LocalStorageKeys.LANG, state.selectedLang)
  }, [state.selectedLang])

  const toggleLang = () => {
    const newLang =
      state.selectedLang === LangOption.EN ? LangOption.VI : LangOption.EN
    toggleLangAction()
    if (newLang === LangOption.EN) {
      message.success('Language changed to English')
    } else {
      message.success('Ngôn ngữ đã thay đổi thành Tiếng Việt')
    }
  }

  return {
    selectedLang: state.selectedLang,
    toggleLang,
    t,
  }
}
