export function dataAddIndex(list) {
    return list.map((item, index) => ({
        ...item,
        id: index + 1
    }))
}