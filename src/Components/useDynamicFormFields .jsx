import { useState, useCallback, useMemo } from "react";

const getNextFiveDates = () => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 5); // Add i days to today's date
  return futureDate.toISOString().substring(0, 10);
};

const values = {
  someDate: getNextFiveDates(),
};

const useDynamicFormFields = (
  initialFields,
  productOption,
  includeAmount = false
) => {
  const [products, setProducts] = useState(initialFields);

  const handleAutocompleteChange = useCallback(
    (index, event, value) => {
      let data = [...products];
      const productObj = productOption.find(
        (item) => item.product__name === value || item.product === value
      );

      data[index] = {
        ...data[index],
        product: value,
        unit: productObj ? productObj.unit : "",
      };
      setProducts(data);
    },
    [products, productOption]
  );

  const handleFormChange = useCallback(
    (index, event) => {
      let data = [...products];
      data[index][event.target.name] = event.target.value;
      setProducts(data);
    },
    [products]
  );

  const addFields = useCallback(() => {
    let newField = {
      product: "",
      unit: "",
      quantity: "",
      rate: "",
      requested_date: values.someDate,
      special_instructions: "",
    };
    setProducts((prevProducts) => [...prevProducts, newField]);
  }, []);

  const removeFields = useCallback((index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  }, []);

  // Optionally calculate amounts for each product
  const productsWithOptionalAmount = useMemo(() => {
    if (!includeAmount) {
      return products;
    }
    return products.map((product) => ({
      ...product,
      amount:
        product.quantity && product.rate
          ? (Number(product.quantity) * Number(product.rate)).toFixed(2)
          : "0.00",
    }));
  }, [products, includeAmount]);

  return {
    products: productsWithOptionalAmount,
    handleAutocompleteChange,
    handleFormChange,
    addFields,
    removeFields,
  };
};

export default useDynamicFormFields;
