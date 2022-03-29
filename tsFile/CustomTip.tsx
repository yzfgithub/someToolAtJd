import React from 'react';
import { Tooltip } from 'antd';

interface IToolTip {
  text: string;
  count: number;
}

const CustomToolTip: React.FC<IToolTip> = (props: IToolTip) => {
  return props.text?.length > props.count ? (
    <Tooltip title={props.text}>
      <span>{props.text.substring(0, props.count)}...</span>
    </Tooltip>
  ) : (
    <span>{props.text}</span>
  );
};

export default CustomToolTip;
