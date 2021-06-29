import { Input, InputProps } from 'antd';
import { isNil } from 'lodash/fp';
import React, { useEffect, useState } from 'react';
import { transformPhoneNumberToDisplay } from '../utils/phoneNumber';

export function PhoneNumberInput(props: InputProps) {
  const { value } = props;
  const [displayValue, setDisplayValue] = useState<string>();

  useEffect(() => {
    if (isNil(value) || typeof value !== 'string') {
      return;
    }

    const formatedValue = transformPhoneNumberToDisplay(value);
    setDisplayValue(formatedValue);
  }, [value]);

  return <Input {...props} value={displayValue} />;
}
