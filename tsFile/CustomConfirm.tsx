import React from 'react';
import { Button, Modal } from 'antd';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

interface ConfirmModalProps {
  modalVisible: boolean;
  content: string;
  title?: string;
  onCancel: () => any;
  onConfirm: () => any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = props => {
  return (
    <Modal
      title=""
      visible={props.modalVisible}
      onCancel={props.onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={props.onConfirm} className="ant-btn-54">
          确定
        </Button>,
        <Button key="back" onClick={props.onCancel} className="ant-btn-54">
          取消
        </Button>
      ]}
      width={460}
      className="ant-modal-confirm-confirm">
      <div className="ant-modal-confirm-body">
        <ExclamationCircleOutlined></ExclamationCircleOutlined>
        <span className="ant-modal-confirm-title">{props.title ?? '提示'}</span>
        <div className="ant-modal-confirm-content">{props.content}</div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
