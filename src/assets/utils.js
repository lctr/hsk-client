
class Utils {
  static shuffleArray(arr, size = 25) {
    const len = arr.length; 
    let indxs = [], r = size, rand;
    // generate an array of necessary lengh consisting of 
    // unique random integers, corresponding to the indices
    // from which we'll later define our new array mutate from
    do {
      rand = Math.floor(Math.random() * len);
      if (indxs.includes(rand)) {
        r++;
      } else {
        indxs.push(rand);
      }
      r--;
    } while (r);
    // replace each random number in the new array with the array 
    // items at the index corresponding to each random number
    for (let i = 0; i < size; i++) {
      indxs[i] = arr[indxs[i]]; 
    }
    return indxs; 
  }
}

export default Utils;