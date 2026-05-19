// Ambient typing for CSS Modules so `tsc --noEmit` resolves
// `import styles from './foo.module.css'` without relying on Next.js's
// per-build generated types under `.next/types/`. The CI typecheck step
// runs before `next build`, so without this declaration TS reports
// "Cannot find module './foo.module.css'" on every CSS Module import.
declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
