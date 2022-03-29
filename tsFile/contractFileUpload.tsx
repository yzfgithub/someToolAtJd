import React, { useState } from 'react';
import styled from 'styled-components';
import { useStore } from '@/stores';
import { Button, Upload, message, Alert } from 'antd';
import CloseCircleOutlined from '@ant-design/icons/CloseOutlined';
import { fileItem } from '@/models';
import { downLoadFileByURL, fileType } from '@/utils';

interface ContractFileComProps {
  fileList: fileItem[];
}

const ContractFileCom: React.FC<ContractFileComProps> = props => {
  const { FileUploadComStore } = useStore();
  const [uploadLoading, setUploadLoading] = useState(false);

  const beforeUpload = (file: { size: number; type: string }) => {
    const isInSize = file.size / 1024 / 1024 < 10;
    const isType = file.type === fileType.png || file.type === fileType.pdf;
    if (!isType) {
      message.error(`上传失败，上传文件格式错误！`);
    } else if (!isInSize) {
      message.error(`上传失败，文件应小于10M！`);
    }

    return isType && isInSize;
  };
  const customRequest = async (options: any) => {
    const formData = new FormData();
    formData.append('file', options.file);
    let type = '';
    switch (options.file.type) {
      case fileType.png:
        type = 'PNG';
        break;
      case fileType.pdf:
        type = 'PDF';
        break;
      default:
        break;
    }
    if (type === '') {
      message.error(`上传失败，文件类型不匹配`);
      return false;
    }
    setUploadLoading(true);
    await FileUploadComStore.uploadFile(formData, type);
    setUploadLoading(false);
  };

  return (
    <PathWrap>
      <div className="upload-box">
        <Upload
          disabled={props.fileList.length === 1}
          accept=".pdf, .png"
          customRequest={customRequest}
          beforeUpload={beforeUpload}
          showUploadList={false}>
          <Button
            disabled={props.fileList.length >= 1 || uploadLoading}
            loading={uploadLoading}
            ghost
            type="primary"
            className="upload-btn ant-btn-88">
            选择文件
          </Button>
        </Upload>{' '}
        <span className="desc">上传附件只支持一个附件，大小不能超过10M，只支持PDF，PNG格式</span>
      </div>
      <div className="file-list">{props.children}</div>
    </PathWrap>
  );
};

interface FileAlertProps {
  index: number;
  file: fileItem;
}

const FileAlert: React.FC<FileAlertProps> = props => {
  const { FileUploadComStore } = useStore();
  const deleteFile = (index: number) => {
    FileUploadComStore.deleteFile(index);
  };
  const onDownload = (fileUrl: string) => {
    const index = fileUrl.lastIndexOf('/');
    downLoadFileByURL(fileUrl, fileUrl.substring(index + 1, fileUrl.length));
  };
  return (
    <Alert
      key={props.index}
      message={
        <span onClick={onDownload.bind(this, props.file.fileUrl)} style={{ cursor: 'pointer' }}>
          {props.file.fileName}
        </span>
      }
      type="success"
      showIcon
      className="custom-alert"
      style={{ margin: '5px 0', width: '380px' }}
      action={<CloseCircleOutlined onClick={deleteFile.bind(this, props.index)} className="close-icon" />}
    />
  );
};

const PathWrap = styled.div`
  .upload-box {
    display: flex;
    align-items: center;
    .upload-btn {
      margin: 0;
    }
    .desc {
      margin-left: 20px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
`;

export { ContractFileCom, FileAlert };
