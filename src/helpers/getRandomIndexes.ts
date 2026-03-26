const getRandomIndexes = (arr:number[], limit:number) => {
    const len = arr.length
    for (let i = 0; i < limit; i++) {
      const j = i + Math.floor(Math.random() * (len - i));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

  return arr.slice(0, limit);
}

export const pickIndexes = (arr: number[], count: number) =>
  arr.length <= count ? arr : getRandomIndexes(arr, count)