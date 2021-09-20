import { Select } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import customers from '../../../../pages/customers';
import { Product } from '../../../services/product';
import { objectContain } from '../../../utils/object';
import { transformPhoneNumberToDisplay } from '../../../utils/phoneNumber';

interface SelectProductFormProps {
  products: Product[];
  onSelectProduct: (productID: string) => any;
}

export function SelectProductForm(props: SelectProductFormProps) {
  const { products, onSelectProduct } = props;
  const [productHints, setProductHints] = useState(products);

  const handleSearchKeyChange = useCallback(
    async (value) => {
      const newProductList = products.filter((product) => objectContain(product, value));

      setProductHints(newProductList);
    },
    [products],
  );

  const options = useMemo(() => {
    return productHints.map((product) => {
      // const phoneNumber = transformPhoneNumberToDisplay(customer.phone_number);

      return (
        <Select.Option value={product.id} key={product.id}>
          <div>
            <div className="text-lg">
              {/* {customer.first_name} {customer.last_name} */}
              {product.product_code}
            </div>
            <div className="text-sm text-gray-400">{product.product_name}</div>
          </div>
        </Select.Option>
      );
    });
  }, [productHints]);

  const handleSelectProduct = useCallback(
    (productID: string) => {
      onSelectProduct(productID);
    },
    [onSelectProduct],
  );

  return (
    <div className="w-full">
      <Select
        className="w-full"
        placeholder={'Enter Search Key Here'}
        showSearch
        filterOption={false}
        onSearch={handleSearchKeyChange}
        onSelect={handleSelectProduct}
      >
        {options}
      </Select>
    </div>
  );
}
