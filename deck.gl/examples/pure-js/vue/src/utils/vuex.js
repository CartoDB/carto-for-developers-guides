import store from '@/store'

export function getters (module, getter) {
  return store.getters[`${module}/${getter}`]
}

export function dispatch (module, actions, payload) {
  return store.dispatch(`${module}/${actions}`, payload)
}

export function commit (module, mutation, payload) {
  return store.commit(`${module}/${mutation}`, payload)
}

export function subscribe (module, mutation, callback) {
  return store.subscribe((mutationStore) => {
    if (mutationStore.type === `${module}/${mutation}`) {
      callback(mutationStore.payload)
    }
  })
}
