export const getLevelGradient = (level: number) => {
  const gradients = [
    "linear-gradient(135deg, #1A8FC1 -2.65%, #78BC49 98.11%)",
    "linear-gradient(45deg, #94B4CC -18.37%, #2C3A52 91.86%)",
    "linear-gradient(45deg, #F7B484 -18.37%, #DC5C24 91.86%)",
    "linear-gradient(225deg, #2E644E 2.27%, #AAD2BE 92.8%)",
    "linear-gradient(45deg, #DC5C24 -18.37%, #791A04 91.86%)",
    "linear-gradient(45deg, #EC901C -18.37%, #FCD468 91.86%)",
    "linear-gradient(225deg, #B3ACCB 2.27%, #4C2D4D 92.8%)",
    "linear-gradient(225deg, #3C5C5C 2.27%, #8ADEEC 92.8%)",
    "linear-gradient(225deg, #446497 2.27%, #77CDEF 92.8%)",
    "linear-gradient(225deg, #2D335C 2.27%, #D28458 47.09%, #A2B2C9 92.8%)",
  ]

  return gradients[level - 1]
}
