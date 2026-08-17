const modules = [
  './gulp/tasks/styles.js',
  './gulp/tasks/scripts.js',
  './gulp/tasks/markup.js',
  './gulp/tasks/assets.js',
  './gulp/tasks/motion.js',
  './gulp/tasks/media.js',
  './gulp/tasks/static.js',
  './gulp/tasks/server.js',
  './gulp/tasks/clean.js',
  './gulp/tasks/lint.js',
  './gulp/tasks/tokens.js',
  './gulp/tasks/content.js',
  './gulp/tasks/audit.js',
  './gulp/tasks/admin.js',
]

let failures = 0

for (const modulePath of modules) {
  try {
    await import(modulePath)
    console.log(`OK ${modulePath}`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${modulePath}`)
    console.error(error?.stack || error)
  }
}

console.log(`Gulp task import diagnostics complete: ${modules.length - failures} passed, ${failures} failed.`)
