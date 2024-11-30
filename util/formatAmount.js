function formatNumber(n) {
  const formattedNum = []
  let str = n.toString()
  let lgth = str.length
  let afterPeriod

  if (str.includes('.')) {
    afterPeriod = str.substring(str.indexOf('.'))
    str = str.substring(0, str.indexOf('.'))
  }
  let counter = 1

  for (let i = str.length - 1; i >= 0; i--) {
    const current = str[i]
    // console.log('current: ', current)

    formattedNum.unshift(current)
    if (counter % 3 === 0 && i > 0) {
      formattedNum.unshift(',')
      lgth += 1

      // console.log(i, current)
    }
    counter++
  }

  return afterPeriod ? formattedNum.join('') + afterPeriod : formattedNum.join('')
}

module.exports = formatNumber
