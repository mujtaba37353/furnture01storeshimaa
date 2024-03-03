const newArray = [
  // existing objects in the array
  // ...

  // new object to be added
  {
    price: 0,
    quantity: 25,
    image: [],
    values: [
      {
        key_en: "colors",
        key_ar: "الألوان",
        value_en: "blue",
        value_ar: "ازرق",
        color: "#310af3",
      },
      // add other values as needed
    ],
  },
];

// Function to check if the array already contains a similar object


// Example usage
const newObject = {
  price: 0,
  quantity: 25,
  image: [],
  values: [
    {
      key_en: "colors",
      key_ar: "الألوان",
      value_en: "blue",
      value_ar: "ازرق",
      color: "#310af3",
    },
    // add other values as needed
  ],
};

if (!hasDuplicate(newArray, newObject)) {
  newArray.push(newObject);
}

console.log(newArray);
