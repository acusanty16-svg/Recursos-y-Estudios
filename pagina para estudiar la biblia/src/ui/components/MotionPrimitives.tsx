import type { ReactNode } from 'react';
import { motion } from 'motion/react';

const EDITORIAL_EASE: readonly [number, number, number, number] = [0.22, 1, 0.36, 1];

const SPRING_GENTLE = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 30,
  mass: 0.9,
};

/** Entrada editorial sutil para páginas y paneles principales. */
export function EditorialFade({
  children,
  className = '',
  delay = 0,
}: {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly delay?: number | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Contenedor escalonado con ritmo sutil (45ms entre bloques). */
export function StaggerGroup({
  children,
  className = '',
}: {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.32, ease: EDITORIAL_EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Superficie interactiva con respuesta física sobria (sin rebotes exagerados). */
export function InteractiveSurface({
  children,
  className = '',
}: {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.992 }}
      transition={SPRING_GENTLE}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Indicador deslizante compartido entre pestañas con física spring. */
export function TabHighlightPill({
  layoutId,
  className = '',
}: {
  readonly layoutId: string;
  readonly className?: string | undefined;
}) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className={className}
    />
  );
}
