// TODO we should bump TS to latest (we are 0.4 versions behind!)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (import.meta.hot) {
  // this is written without the != null part to make sure Webpack (and Vite) recognizes and tree shakes it
  import.meta.hot?.decline() // this _should_ be working but does not for some reason
  import.meta.hot?.on('vite:beforeUpdate', (event) => {
    if (event.updates.some((u) => u.path === '/editor.tsx')) {
      import.meta.hot?.invalidate()
    }
  })
}
