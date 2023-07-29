export const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return

  const separator = "..."
  const separatorLen = separator.length
  const charsToShow = strLen - separatorLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  return (
    fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
  )
}
