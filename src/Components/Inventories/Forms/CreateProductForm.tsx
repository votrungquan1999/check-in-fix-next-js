import { isEmpty, isNil } from 'lodash/fp';
import { useCallback, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { createProduct, CreateProductInput, Product } from '../../../services/product';
import { undefinableParseInt } from '../../../utils/number';
import { validateProductInput } from './helpers';
import { ProductInputFormattedData, ProductInputForm, ProductInputFormData } from './ProductInputForm';

interface CreateProductFormProps extends WithAuthProps {
  createProductSuccessfully: (product: Product) => any;
}

export function CreateProductForm(props: CreateProductFormProps) {
  const { employee, user, createProductSuccessfully } = props;
  const [validationStatuses, setValidationStatuses] = useState<object>({});
  const [validationHelpers, setValidationHelpers] = useState<object>({});

  const createProductHandler = useCallback(
    async (inputData: ProductInputFormattedData) => {
      const { token } = await user.getIdTokenResult();

      const payload: CreateProductInput = {
        ...inputData,
        subscriber_id: employee.subscriber_id,
      };

      const createdProduct = await createProduct(payload, token);
      if (!isNil(createdProduct)) {
        createProductSuccessfully(createdProduct);
      }
    },
    [user, employee, createProductSuccessfully],
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

      await createProductHandler(formattedFormData);
    },
    [createProductHandler],
  );

  const handleFieldChanges = useCallback(() => {
    setValidationHelpers({});
    setValidationStatuses({});
  }, []);

  return (
    <ProductInputForm
      title={'Create Product'}
      handleSubmitForm={onFormSubmit}
      validationHelpers={validationHelpers}
      validationStatuses={validationStatuses}
      handleFieldChanges={handleFieldChanges}
    />
  );
}
