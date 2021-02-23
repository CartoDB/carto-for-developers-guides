export function disableVueObserver (obj) {
  const isObject = obj && typeof obj === 'object'
  if (isObject) {
    // this marks the object as a Vue Component, so it avoids being observed
    obj._isVue = true
    // this three properties avoid conflicts when inspecting it with Vue DevTools as of Nov 2019
    obj.$options = {}
    obj.$refs = {}
    obj._data = {}
  }
  return obj
}
