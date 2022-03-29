import React from 'react';
import { Select } from 'antd';

const getVenderCode = (str: string) => {
  return str?.toString().split(':')[0] ?? '';
};
const SelectOption = (list: { value: string | number; label: string | number }[], type?: string) => {
  if (list && list.length) {
    return list.map((ele: { value: any; label: any }, index: string | number | undefined) => (
      <Select.Option key={index} value={ele.value} label={ele.label}>
        {type === 'vender' ? `${ele.label}(${getVenderCode(ele.value as string)})` : `${ele.label}`}
      </Select.Option>
    ));
  }
  return [];
};

export default SelectOption;
