import React from 'react';
import type { SystemInfo as ChannelSystemInfo } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatLocalDateTime } from '@/utils/dateUtils';
import CollapsibleSection from '../ui/CollapsibleSection';

// 常用语言代码到显示名称的映射（简体中文版本）
const LANGUAGE_DISPLAY_NAMES_ZH_CN: Record<string, string> = {
  'zh': 'Chino',
  'zh-CN': 'Chino simplificado',
  'zh-TW': 'Chino tradicional (Taiwán)',
  'zh-HK': 'Chino tradicional (Hong Kong)',
  'zh-Hans': 'Chino simplificado',
  'zh-Hant': 'Chino tradicional',
  'en': 'Inglés',
  'en-US': 'Inglés (Estados Unidos)',
  'en-GB': 'Inglés (Reino Unido)',
  'en-AU': 'Inglés (Australia)',
  'ja': 'Japonés',
  'ja-JP': 'Japonés',
  'ko': 'Coreano',
  'ko-KR': 'Coreano',
  'fr': 'Francés',
  'fr-FR': 'Francés',
  'de': 'Alemán',
  'de-DE': 'Alemán',
  'es': 'Español',
  'es-ES': 'Español',
  'pt': 'Portugués',
  'pt-BR': 'Portugués (Brasil)',
  'pt-PT': 'Portugués (Portugal)',
  'ru': 'Ruso',
  'ru-RU': 'Ruso',
  'ar': 'Árabe',
  'ar-SA': 'Árabe',
  'th': 'Tailandés',
  'th-TH': 'Tailandés',
  'vi': 'Vietnamita',
  'vi-VN': 'Vietnamita',
  'it': 'Italiano',
  'it-IT': 'Italiano',
  'nl': 'Neerlandés',
  'nl-NL': 'Neerlandés',
  'pl': 'Polaco',
  'pl-PL': 'Polaco',
  'tr': 'Turco',
  'tr-TR': 'Turco',
  'id': 'Indonesio',
  'id-ID': 'Indonesio',
  'ms': 'Malayo',
  'ms-MY': 'Malayo',
};

// 常用语言代码到显示名称的映射（繁体中文版本）
const LANGUAGE_DISPLAY_NAMES_ZH_TW: Record<string, string> = {
  'zh': 'Chino',
  'zh-CN': 'Chino simplificado',
  'zh-TW': 'Chino tradicional (Taiwán)',
  'zh-HK': 'Chino tradicional (Hong Kong)',
  'zh-Hans': 'Chino simplificado',
  'zh-Hant': 'Chino tradicional',
  'en': 'Inglés',
  'en-US': 'Inglés (Estados Unidos)',
  'en-GB': 'Inglés (Reino Unido)',
  'en-AU': 'Inglés (Australia)',
  'ja': 'Japonés',
  'ja-JP': 'Japonés',
  'ko': 'Coreano',
  'ko-KR': 'Coreano',
  'fr': 'Francés',
  'fr-FR': 'Francés',
  'de': 'Alemán',
  'de-DE': 'Alemán',
  'es': 'Español',
  'es-ES': 'Español',
  'pt': 'Portugués',
  'pt-BR': 'Portugués (Brasil)',
  'pt-PT': 'Portugués (Portugal)',
  'ru': 'Ruso',
  'ru-RU': 'Ruso',
  'ar': 'Árabe',
  'ar-SA': 'Árabe',
  'th': 'Tailandés',
  'th-TH': 'Tailandés',
  'vi': 'Vietnamita',
  'vi-VN': 'Vietnamita',
  'it': 'Italiano',
  'it-IT': 'Italiano',
  'nl': 'Neerlandés',
  'nl-NL': 'Neerlandés',
  'pl': 'Polaco',
  'pl-PL': 'Polaco',
  'tr': 'Turco',
  'tr-TR': 'Turco',
  'id': 'Indonesio',
  'id-ID': 'Indonesio',
  'ms': 'Malayo',
  'ms-MY': 'Malayo',
};

// 常用语言代码到显示名称的映射（英文版本）
const LANGUAGE_DISPLAY_NAMES_EN: Record<string, string> = {
  'zh': 'Chinese',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional, Taiwan)',
  'zh-HK': 'Chinese (Traditional, Hong Kong)',
  'zh-Hans': 'Chinese (Simplified)',
  'zh-Hant': 'Chinese (Traditional)',
  'en': 'English',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'en-AU': 'English (Australia)',
  'ja': 'Japanese',
  'ja-JP': 'Japanese',
  'ko': 'Korean',
  'ko-KR': 'Korean',
  'fr': 'French',
  'fr-FR': 'French',
  'de': 'German',
  'de-DE': 'German',
  'es': 'Spanish',
  'es-ES': 'Spanish',
  'pt': 'Portuguese',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'ru': 'Russian',
  'ru-RU': 'Russian',
  'ar': 'Arabic',
  'ar-SA': 'Arabic',
  'th': 'Thai',
  'th-TH': 'Thai',
  'vi': 'Vietnamese',
  'vi-VN': 'Vietnamese',
  'it': 'Italian',
  'it-IT': 'Italian',
  'nl': 'Dutch',
  'nl-NL': 'Dutch',
  'pl': 'Polish',
  'pl-PL': 'Polish',
  'tr': 'Turkish',
  'tr-TR': 'Turkish',
  'id': 'Indonesian',
  'id-ID': 'Indonesian',
  'ms': 'Malay',
  'ms-MY': 'Malay',
};

/**
 * 根据当前 UI 语言获取对应的语言名称映射表
 */
const getLanguageDisplayNames = (uiLang: string): Record<string, string> => {
  if (uiLang.startsWith('zh-TW') || uiLang.startsWith('zh-HK') || uiLang.startsWith('zh-Hant')) {
    return LANGUAGE_DISPLAY_NAMES_ZH_TW;
  }
  if (uiLang.startsWith('zh')) {
    return LANGUAGE_DISPLAY_NAMES_ZH_CN;
  }
  return LANGUAGE_DISPLAY_NAMES_EN;
};

/**
 * 将语言代码转换为友好的显示名称
 * @param code - 语言代码 (e.g., 'zh-CN', 'en-US')
 * @param uiLang - 当前 UI 语言 (e.g., 'zh-CN', 'zh-TW', 'en')
 * @returns 友好的语言名称
 */
const formatLanguageCode = (code?: string | null, uiLang: string = 'zh-CN'): string => {
  if (!code || code.trim() === '') return '-';
  
  const trimmedCode = code.trim();
  const displayNames = getLanguageDisplayNames(uiLang);
  
  // 先尝试精确匹配
  if (displayNames[trimmedCode]) {
    return displayNames[trimmedCode];
  }
  
  // 尝试只用语言部分匹配（如 zh-CN 匹配 zh）
  const langPart = trimmedCode.split('-')[0].toLowerCase();
  const matchedKey = Object.keys(displayNames).find(
    key => key.toLowerCase() === langPart
  );
  if (matchedKey) {
    return displayNames[matchedKey];
  }
  
  // 如果都没匹配到，尝试使用浏览器内置的 Intl.DisplayNames
  try {
    const intlDisplayNames = new Intl.DisplayNames([uiLang], { type: 'language' });
    const displayName = intlDisplayNames.of(trimmedCode);
    if (displayName && displayName !== trimmedCode) {
      return displayName;
    }
  } catch {
    // Intl.DisplayNames 不支持该语言代码
  }
  
  // 最后返回原始代码
  return trimmedCode;
};

interface SystemInfoSectionProps {
  systemInfo?: ChannelSystemInfo | null;
  language?: string;
  timezone?: string;
  ipAddress?: string;
  displayLocation?: string;
  className?: string;
  draggable?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

/**
 * 系统信息模块组件
 */
const SystemInfoSection: React.FC<SystemInfoSectionProps> = ({
  systemInfo,
  language: languageProp,
  timezone: timezoneProp,
  ipAddress: ipAddressProp,
  displayLocation: displayLocationProp,
  className = '',
  draggable,
  expanded,
  onToggle,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'zh-CN';
  const isUrl = (v?: string | null) => !!v && /^(https?:)\/\//i.test(v.trim());

  const valueOrDash = (v?: string | null) => (v && v.trim() !== '' ? v : '-');

  const platform = valueOrDash(systemInfo?.platform);
  const sourceDetail = valueOrDash(systemInfo?.source_detail);
  const browser = valueOrDash(systemInfo?.browser);
  const os = valueOrDash(systemInfo?.operating_system);
  const firstSeen = formatLocalDateTime(systemInfo?.first_seen_at);
  const language = formatLanguageCode(languageProp, currentLang);
  const timezone = valueOrDash(timezoneProp);
  const ipAddress = valueOrDash(ipAddressProp);
  const displayLocation = valueOrDash(displayLocationProp);

  const sourceDetailRaw = systemInfo?.source_detail ?? null;
  const sourceDetailUrl = typeof sourceDetailRaw === 'string' && isUrl(sourceDetailRaw) ? sourceDetailRaw : null;
  const hasAnyInfo =
    Boolean(systemInfo) ||
    Boolean((languageProp ?? '').trim()) ||
    Boolean((timezoneProp ?? '').trim()) ||
    Boolean((ipAddressProp ?? '').trim()) ||
    Boolean((displayLocationProp ?? '').trim());

  return (
    <CollapsibleSection
      title={t('visitor.sections.systemInfo', '系统信息')}
      className={className}
      defaultExpanded={false}
      expanded={expanded}
      onToggle={onToggle}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {hasAnyInfo ? (
        <div className="space-y-1 px-0.5">
          {[
            { label: t('visitor.system.fields.platform', '平台'), value: platform },
            { 
              label: t('visitor.system.fields.sourcePage', '来源页面'), 
              value: sourceDetailUrl ? (
                <a href={sourceDetailUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all" title={sourceDetailUrl}>
                  {sourceDetailUrl}
                </a>
              ) : sourceDetail 
            },
            { label: t('visitor.system.fields.browser', '浏览器'), value: browser },
            { label: t('visitor.system.fields.os', '操作系统'), value: os },
            { label: t('visitor.system.fields.language', '语言'), value: language },
            { label: t('visitor.system.fields.timezone', '时区'), value: timezone },
            { label: t('visitor.system.fields.ipAddress', 'IP 地址'), value: ipAddress },
            { label: t('visitor.system.fields.location', '位置'), value: displayLocation },
            { label: t('visitor.system.fields.firstSeen', '首次访问'), value: firstSeen },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-start py-0.5 group">
              <span className="text-gray-400 dark:text-gray-500 text-[12px] flex-shrink-0 pt-0.5">{item.label}</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium text-[12px] leading-5 flex-1 min-w-0 ml-4 text-right line-clamp-2 break-all">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[12px] text-gray-400 dark:text-gray-500 py-4 text-center italic">{t('visitor.system.empty', '暂无系统信息')}</div>
      )}
    </CollapsibleSection>
  );
};

export default SystemInfoSection;
