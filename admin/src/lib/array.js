export function reorder(list) {
  return list.map((item, i) => ({ ...item, order: i }))
}

export function move(list, index, dir) {
  const next = [...list]
  const target = index + dir
  if (target < 0 || target >= next.length) return list
  ;[next[index], next[target]] = [next[target], next[index]]
  return reorder(next)
}
