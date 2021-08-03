import { Upload } from 'antd';
import styled from 'styled-components';

export function getCustomUploader(width: number = 128, height: number = 128) {
  return styled(Upload)`
    .ant-upload,
    .ant-upload-list-picture-card-container {
      width: ${width}px;
      height: ${height}px;
    }

    .ant-upload-list-item-actions svg {
      width: 25px;
      height: 25px;
    }

    .ant-upload-list-item-actions {
      display: flex;
      column-gap: 20px;
    }
  `;

  // return UploadComponent;
}
