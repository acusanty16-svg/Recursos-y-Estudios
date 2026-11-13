import type { NoteCategory } from '@model/types';
import { BookIcon, GraduationIcon, HeartIcon, MicIcon, NoteIcon } from './icons';

export const CATEGORY_STYLES: Record<
  NoteCategory,
  {
    readonly badge: string;
    readonly border: string;
    readonly Icon: typeof BookIcon;
  }
> = {
  verse: {
    badge: 'bg-ember-500/10 text-ember-700 border-ember-500/25 dark:bg-ember-500/15 dark:text-ember-300 dark:border-ember-400/25',
    border: 'border-l-ember-500',
    Icon: BookIcon,
  },
  sermon: {
    badge: 'bg-sky-500/10 text-sky-700 border-sky-500/25 dark:bg-sky-400/15 dark:text-sky-300 dark:border-sky-300/25',
    border: 'border-l-sky-500',
    Icon: MicIcon,
  },
  study: {
    badge: 'bg-gold-500/15 text-gold-700 border-gold-500/30 dark:bg-gold-400/15 dark:text-gold-300 dark:border-gold-400/25',
    border: 'border-l-gold-500',
    Icon: NoteIcon,
  },
  seminar: {
    badge: 'bg-sage-500/15 text-sage-500 border-sage-500/30 dark:bg-sage-300/15 dark:text-sage-300 dark:border-sage-300/25',
    border: 'border-l-sage-500',
    Icon: GraduationIcon,
  },
  devotional: {
    badge: 'bg-rose-500/10 text-rose-500 border-rose-500/25 dark:bg-rose-300/15 dark:text-rose-300 dark:border-rose-300/25',
    border: 'border-l-rose-500',
    Icon: HeartIcon,
  },
};
