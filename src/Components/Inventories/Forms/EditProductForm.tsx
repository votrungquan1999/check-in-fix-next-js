import { isEmpty, isNil } from 'lodash/fp';
import { FieldData } from 'rc-field-form/lib/interface';
import { useCallback, useMemo, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import {
  createProduct,
  CreateProductInput,
  Product,
  updateProduct,
  UpdateProductInput,
} from '../../../services/product';
import { undefinableParseInt } from '../../../utils/number';
import { checkDataChanges, validateProductInput } from './helpers';
import { ProductInputFormattedData, ProductInputForm, ProductInputFormData } from './ProductInputForm';

interface EditProductFormProps extends WithAuthProps {
  editProductSuccessfully: (product: Product) => any;
  product: Product;
}

export function EditProductForm(props: EditProductFormProps) {
  const { employee, user, editProductSuccessfully, product } = props;
  const [validationStatuses, setValidationStatuses] = useState<object>({});
  const [validationHelpers, setValidationHelpers] = useState<object>({});

  const initData: ProductInputFormData = useMemo(() => {
    return {
      alert_quantity: product.alert_quantity?.toString(),
      product_code: product.product_code,
      product_cost: product.product_cost?.toString(),
      product_detail: product.product_detail,
      product_name: product.product_name,
      product_price: product.product_price?.toString(),
      product_tax: product.product_tax?.toString(),
      product_type: product.product_type,
      product_unit: product.product_unit?.toString(),
      quantity: product.quantity?.toString(),
      tax_method: product.tax_method,
    };
  }, [product]);

  const editProductHandler = useCallback(
    async (inputData: ProductInputFormattedData) => {
      const { token } = await user.getIdTokenResult();

      const payload: UpdateProductInput = {
        ...inputData,
      };

      console.log(payload);
      const editedProduct = await updateProduct(product.id, payload, token);
      if (!isNil(editedProduct)) {
        editProductSuccessfully(editedProduct);
      }
    },
    [user, employee, editProductSuccessfully],
  );

  const onFormSubmit = useCallback(
    async (formData: ProductInputFormData) => {
      const [newValidationStatuses, newValidationHelpers] = validateProductInput(formData);
      setValidationHelpers(newValidationHelpers);
      setValidationStatuses(newValidationStatuses);
      if (!isEmpty(newValidationStatuses) || !isEmpty(newValidationHelpers)) {
        return;
      }

      const formattedFormData: ProductInputFormattedData = {
        ...formData,
        alert_quantity: undefinableParseInt(formData.alert_quantity),
        quantity: undefinableParseInt(formData.quantity),
        product_unit: undefinableParseInt(formData.product_unit),
        product_cost: undefinableParseInt(formData.product_cost),
        product_price: undefinableParseInt(formData.product_price),
      };

      await editProductHandler(formattedFormData);
    },
    [editProductHandler],
  );

  const handleFieldChanges = useCallback(
    (_, allFields: FieldData[]) => {
      setValidationHelpers({});
      const newValidationStatuses = checkDataChanges(initData, allFields);
      setValidationStatuses(newValidationStatuses);
    },
    [initData],
  );

  return (
    <ProductInputForm
      title={'Edit Product'}
      handleSubmitForm={onFormSubmit}
      validationHelpers={validationHelpers}
      validationStatuses={validationStatuses}
      handleFieldChanges={handleFieldChanges}
      initData={initData}
    />
  );
}
