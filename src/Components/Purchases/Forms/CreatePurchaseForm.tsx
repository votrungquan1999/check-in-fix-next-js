import { isNil } from 'lodash/fp';
import { useCallback } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { createPurchase, CreatePurchaseInput, Purchases } from '../../../services/purchases';
import { PurchaseInputForm } from './PurchaseInputForm';

interface CreatePurchaseFormProps extends WithAuthProps {
  onCreatePurchaseSuccessfully: (purchase: Purchases) => any;
}

export function CreatePurchaseForm(props: CreatePurchaseFormProps) {
  const { employee, user, onCreatePurchaseSuccessfully } = props;

  const handleSubmitPurchase = useCallback(
    async (input: CreatePurchaseInput) => {
      console.log(input);
      const { token } = await user.getIdTokenResult();

      const purchase = await createPurchase(input, token);
      if (isNil(purchase)) {
        return;
      }

      onCreatePurchaseSuccessfully(purchase);
    },
    [onCreatePurchaseSuccessfully, user, employee],
  );

  return (
    <div>
      <PurchaseInputForm employee={employee} user={user} onSubmitForm={handleSubmitPurchase} />
    </div>
  );
}
