import { Button, DatePicker, Form, Input, Select, SelectProps, Spin, Table, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { any, isNil } from 'lodash/fp';
import React, { useCallback, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { CreatePurchaseInput, PurchaseProduct } from '../../../services/purchases';
import { ResponsiveFormStyled } from '../../../styles/commons';
import { AddPurchaseProductsModal } from '../Modals/AddPurchaseProductModal';
import { PurchaseProductTable } from '../Tables/PurchaseProductTable';

interface PurchaseInputFormProps extends WithAuthProps {
  onSubmitForm: (input: CreatePurchaseInput) => any;
}

interface InputPurchaseFormData {
  date?: string;
  discount?: string;
  instore_credit?: string;
  note?: string;
  reference_number?: string;
  shipping_fee?: string;
  status?: string;
  supplier?: string;
}

// export interface InputPurchaseData {

// }

export function PurchaseInputForm(props: PurchaseInputFormProps) {
  const { user, employee, onSubmitForm } = props;
  const [form] = useForm();
  const [purchaseProducts, setPurchaseProducts] = useState<PurchaseProduct[]>([]);
  const [addingPurchaseProduct, setAddingPurchaseProduct] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleClickSubmit = useCallback(async () => {
    const data = form.getFieldsValue() as InputPurchaseFormData;

    const discount = data.discount ? parseFloat(data.discount) : 0;
    const instoreCredit = data.instore_credit ? parseFloat(data.instore_credit) : 0;
    const shippingFee = data.shipping_fee ? parseFloat(data.shipping_fee) : 0;

    const createPurchaseInput: CreatePurchaseInput = {
      discount: discount,
      instore_credit: instoreCredit,
      purchase_products: purchaseProducts,
      shipping_fee: shippingFee,
      status: data.status ?? 'Ordered',
      subscriber_id: employee.subscriber_id,
      date: data.date,
      notes: data.note,
      reference_number: data.reference_number,
      supplier: data.supplier,
    };

    setSubmitting(true);

    await onSubmitForm(createPurchaseInput);

    setSubmitting(false);
  }, [purchaseProducts]);

  const handleClickAddProduct = useCallback(() => {
    setAddingPurchaseProduct(true);
  }, []);

  const handleFinishAddingPurchaseProduct = useCallback(
    (purchaseProduct?: PurchaseProduct) => {
      if (!isNil(purchaseProduct)) {
        setPurchaseProducts([...purchaseProducts, purchaseProduct]);
      }

      setAddingPurchaseProduct(false);
    },
    [purchaseProducts],
  );

  const handleFieldChanges = useCallback(() => {
    const data = form.getFieldsValue() as InputPurchaseFormData;

    if (!isNil(data.shipping_fee)) {
      setShippingFee(parseFloat(data.shipping_fee));
    }

    if (!isNil(data.discount)) {
      setDiscount(parseFloat(data.discount));
    }
  }, []);

  return (
    <div>
      <Spin spinning={submitting} size="large">
        <Form form={form} layout="vertical" onFieldsChange={handleFieldChanges}>
          <PurchaseInfoInput />

          <PurchaseProductTable handleClickAddProduct={handleClickAddProduct} purchaseProducts={purchaseProducts} />

          <AdditionalInfoInput />

          <Summary purchaseProducts={purchaseProducts} shippingFee={shippingFee} purchaseDiscount={discount} />

          <Form.Item className="mt-3">
            <Button onClick={handleClickSubmit}>Submit</Button>
          </Form.Item>
        </Form>
        <AddPurchaseProductsModal
          modalVisible={addingPurchaseProduct}
          onFinishAddingPurchaseProduct={handleFinishAddingPurchaseProduct}
          employee={employee}
          user={user}
        />
      </Spin>
    </div>
  );
}

function PurchaseInfoInput() {
  return (
    <div>
      <Typography.Title level={4}>General Info</Typography.Title>
      <ResponsiveFormStyled>
        <Form.Item name="date" label="Date">
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item name="reference_number" label="Reference Number">
          <Input />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <SelectStatusInput />
        </Form.Item>

        <Form.Item name="supplier" label="Supplier">
          <Input />
        </Form.Item>
      </ResponsiveFormStyled>
    </div>
  );
}

function SelectStatusInput(props: SelectProps<any>) {
  return (
    <Select {...props}>
      <Select.Option value="Ordered">Ordered</Select.Option>
      <Select.Option value="Pending">Pending</Select.Option>
      <Select.Option value="Received">Received</Select.Option>
    </Select>
  );
}

function AdditionalInfoInput() {
  return (
    <div>
      <Typography.Title level={4}>More Options</Typography.Title>
      <ResponsiveFormStyled>
        <Form.Item name="discount" label="Discount">
          <Input />
        </Form.Item>
        <Form.Item name="instore_credit" label="Instore Credit">
          <Input />
        </Form.Item>
        <Form.Item name="shipping_fee" label="Shipping Fee">
          <Input />
        </Form.Item>
      </ResponsiveFormStyled>
      <Form.Item name="note" label="Note">
        <Input.TextArea placeholder="Add note" autoSize={{ minRows: 8, maxRows: 8 }} />
      </Form.Item>
    </div>
  );
}

interface SummaryProps {
  purchaseProducts: PurchaseProduct[];
  shippingFee: number;
  purchaseDiscount: number;
}

interface SummaryField {
  name: string;
  value: string | number;
}

function Summary(props: SummaryProps) {
  const { purchaseProducts, shippingFee, purchaseDiscount } = props;

  const totalItems = purchaseProducts.reduce((total, item) => total + item.quantity, 0);
  const totalCost = purchaseProducts.reduce((total, item) => total + item.quantity * item.unit_cost, 0);
  const totalDiscount = purchaseProducts.reduce((total, item) => total + item.discount, 0) + purchaseDiscount;
  const grandTotal = totalCost - totalDiscount + shippingFee;

  const fields: SummaryField[] = [
    {
      name: 'Items',
      value: `${purchaseProducts.length}(${totalItems})`,
    },
    {
      name: 'Total',
      value: totalCost,
    },
    {
      name: 'Discount',
      value: totalDiscount,
    },
    {
      name: 'Shipping',
      value: shippingFee,
    },
    {
      name: 'Grand Total',
      value: grandTotal,
    },
  ];

  return (
    <div className="flex justify-between border sticky bottom-0 bg-gray-100">
      {fields.map((field, index) => {
        return (
          <div key={index} className="border-l p-1">
            {field.name}: {field.value}
          </div>
        );
      })}
    </div>
  );
}
