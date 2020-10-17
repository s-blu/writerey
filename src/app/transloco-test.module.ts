import { TranslocoConfig, TranslocoTestingModule } from '@ngneat/transloco';
import en from '../assets/i18n/en.json';
import de from '../assets/i18n/de.json';

export function getTranslocoTestingModule(config: Partial<TranslocoConfig> = {}) {
  return TranslocoTestingModule.withLangs(
    { en, de },
    {
      availableLangs: ['en', 'de'],
      defaultLang: 'en',
      ...config,
    }
  );
}
